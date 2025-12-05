import { useAuthStore } from "@/stores/auth"

export async function ensureProfileLoaded() {
  const store = useAuthStore.getState()

  // Tidak login
  if (!store.refreshToken && !store.accessToken) {
    return false
  }

  // Jika belum ada accessToken (baru reload halaman)
  if (!store.accessToken && store.refreshToken) {
    await store.refreshAccessToken()
  }

  // Jika profile sudah di-load → selesai
  if (store.user && store.permissions.length > 0) {
    return true
  }

  // Kalau profile sedang diload, tunggu
  if (store.isLoadingProfile) {
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (!useAuthStore.getState().isLoadingProfile) {
          clearInterval(interval)
          resolve(true)
        }
      }, 30)
    })
  }

  // Jika belum punya profile → fetch sekarang
  if (!store.user) {
    await store.fetchProfile()
  }

  return true
}
