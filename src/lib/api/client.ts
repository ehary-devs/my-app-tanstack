import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = 'http://localhost:3000/api'

// Flag untuk mencegah multiple refresh calls bersamaan
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

interface FetchOptions extends RequestInit {
  skipAuth?: boolean // Untuk endpoint yang tidak perlu auth (login, refresh)
}

/**
 * API Client dengan auto-refresh token
 * Otomatis menambahkan Authorization header dan handle token refresh
 */
export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options
  const authStore = useAuthStore.getState()

  // Build URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  // Prepare headers
  const headers = new Headers(fetchOptions.headers)

  // Add Authorization header jika tidak skip auth
  if (!skipAuth && authStore.accessToken) {
    headers.set('Authorization', `Bearer ${authStore.accessToken}`)
  }

  // Set Content-Type jika ada body dan belum di-set
  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // Make request
  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  // Handle 401 Unauthorized - token expired
  if (response.status === 401 && !skipAuth && authStore.refreshToken) {
    // Refresh token
    const newAccessToken = await refreshTokenIfNeeded()

    if (newAccessToken) {
      // Retry original request dengan token baru
      headers.set('Authorization', `Bearer ${newAccessToken}`)
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      })
    } else {
      // Refresh gagal, logout user
      authStore.logout()
      throw new Error('Session expired. Please login again.')
    }
  }

  return response
}

/**
 * Helper untuk refresh token dengan deduplication
 * Mencegah multiple refresh calls bersamaan
 */
async function refreshTokenIfNeeded(): Promise<string | null> {
  const authStore = useAuthStore.getState()

  // Jika sudah ada refresh yang sedang berjalan, tunggu hasilnya
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  // Mulai proses refresh
  isRefreshing = true
  refreshPromise = authStore.refreshAccessToken()
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

/**
 * Helper untuk fetch dengan auto-parse JSON
 */
export async function apiFetchJson<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiFetch(endpoint, options)
  
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Request failed with status ${response.status}`
    
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch {
      errorMessage = errorText || errorMessage
    }
    
    throw new Error(errorMessage)
  }

  return response.json()
}

