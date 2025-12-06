import { create } from "zustand"
import { apiFetchJson } from "../lib/api"
import type { Profile, AuthStore, Permission, Role } from "../types/auth"

// Merge permissions dari user + roles
function extractPermissions(profile: Profile): Permission[] {
  const userPerms = profile.permissions ?? []
  const rolePerms = (profile.roles ?? []).flatMap((r: Role) => r.permissions ?? [])

  return [...userPerms, ...rolePerms].filter(
    (p, i, arr) => i === arr.findIndex(x => x.name === p.name)
  )
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  roles: [],
  permissions: [],
  isLoadingProfile: false,
  hasFetchedProfile: false,

  // Fetch login
  login: async (emailOrUsername: string, password: string) => {
    try {
      await apiFetchJson("/auth/login", {
        method: "POST",
        body: JSON.stringify({ emailOrUsername, password }),
        credentials: "include",
      })

      const profile = await get().fetchProfile()
      return !!profile
    } catch (error) {
      throw error
    }
  },

  // Fetch profile dari backend (via HttpOnly cookie)
  fetchProfile: async () => {
    if (get().hasFetchedProfile) return get().user

    set({ isLoadingProfile: true })

    try {
      const json = await apiFetchJson("/users/me/profile", {
        credentials: "include", // penting!
      })

      set({
        user: json.data,
        roles: json.data.roles ?? [],
        permissions: extractPermissions(json.data),
        hasFetchedProfile: true,
      })

      return json.data
    } finally {
      set({ isLoadingProfile: false })
    }
  },

  // Logout
  logout: async () => {
    await apiFetchJson("/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    set({
      user: null,
      roles: [],
      permissions: [],
      hasFetchedProfile: false,
    })
  },
}))
