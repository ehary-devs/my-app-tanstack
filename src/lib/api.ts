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
    const text = await res.text()
    throw new Error(text || `API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
