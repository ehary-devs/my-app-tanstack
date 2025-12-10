// src/lib/api.ts

const API_BASE_URL = "http://localhost:3000/api"

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
}

export async function apiFetchJson<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await apiFetch(endpoint, options)

  if (!res.ok) {
    // Handle 401 authentication errors
    if (res.status === 401) {
      try {
        const json = await res.json()
        // Check if it's an authentication error
        if (
          json.statusCode === 401 ||
          json.message === "Authentication required" ||
          json.errors === "Authentication required"
        ) {
          // Redirect to login page
          window.location.href = "/login"
          throw new Error("Authentication required")
        }
      } catch (parseError) {
        // If JSON parsing fails, still redirect on 401
        window.location.href = "/login"
        throw new Error("Authentication required")
      }
    }

    const text = await res.text()
    throw new Error(text || `API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
