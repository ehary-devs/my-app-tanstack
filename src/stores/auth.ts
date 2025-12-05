import { create } from 'zustand'
import type { 
  Permission, 
  Profile, 
  Role, 
  AuthStore, 
  ApiResponse, 
  LoginResponse, 
  RefreshTokenResponse 
} from '../types/auth'
import { apiFetchJson } from '../lib/api/client'

// ===== Storage Helpers (Lebih aman dari localStorage) =====
const STORAGE_KEY = 'auth-refresh-token'

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function setRefreshToken(token: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (token) {
      sessionStorage.setItem(STORAGE_KEY, token)
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

// ===== Helper Merge Permission =====
function extractPermissions(profile: Profile): Permission[] {
  const userPerms = profile.permissions ?? []

  const rolePerms = (profile.roles ?? [])
    .flatMap((role: Role) => role.permissions ?? [])

  // Hapus duplikat permission name
  const merged = [...userPerms, ...rolePerms]

  const unique = merged.filter(
    (p, index, self) =>
      index === self.findIndex(x => x.name === p.name)
  )

  return unique
}

// ===== Store =====
export const useAuthStore = create<AuthStore>((set, get) => ({
      // AccessToken hanya di memory (lebih aman, hilang saat refresh)
      // RefreshToken di sessionStorage (lebih aman dari localStorage)
      accessToken: null,
      refreshToken: getRefreshToken(), // Load dari sessionStorage saat init
      user: null,
      roles: [],
      permissions: [],
      isLoadingProfile: false,

      // =====================================
      // ---- SET TOKEN ----
      // =====================================
      setTokens: (accessToken: string | null, refreshToken: string | null) => {
        // Simpan refreshToken ke sessionStorage
        setRefreshToken(refreshToken)
        set({ accessToken, refreshToken })
      },

      // =====================================
      // ---- SET PROFILE ----
      // =====================================
      setProfile: (profile: Profile) =>
        set({
          user: profile,
          roles: profile.roles ?? [],
          permissions: extractPermissions(profile),
        }),

      // =====================================
      // ---- CLEAR AUTH ----
      // =====================================
      logout: () => {
        // Hapus refreshToken dari sessionStorage
        setRefreshToken(null)
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          roles: [],
          permissions: [],
        })
      },

  // =====================================
  // ---- LOGIN ----
  // =====================================
  login: async (email: string, password: string) => {
    const json = await apiFetchJson<ApiResponse<LoginResponse>>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ emailOrUsername: email, password }),
        skipAuth: true, // Login endpoint tidak perlu auth
      }
    )

    // Handle unsuccessful responses
    if (!json.success) {
      throw new Error(json.message || "Login failed")
    }

    const data = json.data

    // Simpan token
    get().setTokens(data.accessToken, data.refreshToken)

    // Ambil profil user
    await get().fetchProfile()

    return true
  },

  // =====================================
  // ---- FETCH PROFILE ----
  // =====================================
  fetchProfile: async () => {
    const token = get().accessToken
    if (!token) return

    set({ isLoadingProfile: true })

    try {
      const json = await apiFetchJson<ApiResponse<Profile>>(
        "/users/me/profile"
      )

      if (!json.success) throw new Error(json.message)

      console.log(json.data)

      get().setProfile(json.data)
      return json.data
    } finally {
      set({ isLoadingProfile: false })
    }
  },

  // =====================================
  // ---- REFRESH TOKEN ----
  // =====================================
  refreshAccessToken: async () => {
    const { refreshToken } = get()
    if (!refreshToken) return null

    try {
      const json = await apiFetchJson<ApiResponse<RefreshTokenResponse>>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
          skipAuth: true, // Refresh endpoint tidak perlu auth
        }
      )

      if (!json.success) {
        get().logout()
        return null
      }

      const newAccess = json.data.accessToken
      const newRefresh = json.data.refreshToken
      
      // Update kedua token jika ada refreshToken baru, atau hanya accessToken
      if (newRefresh) {
        setRefreshToken(newRefresh) // Simpan refreshToken baru ke sessionStorage
        set({ accessToken: newAccess, refreshToken: newRefresh })
      } else {
        set({ accessToken: newAccess })
      }

      return newAccess
    } catch (error) {
      // Jika refresh gagal, logout user
      get().logout()
      return null
    }
  },
}))
