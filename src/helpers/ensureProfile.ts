import { useAuthStore } from "@/stores/auth"

export async function ensureProfileLoaded() {
  const store = useAuthStore.getState()

  if (store.user && store.permissions.length > 0) {
    return true
  }

  try {
    await store.fetchProfile()
    return true
  } catch {
    return false
  }
}
