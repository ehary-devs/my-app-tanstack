import { createFileRoute, redirect } from "@tanstack/react-router"
import { ensureProfileLoaded } from "@/helpers/ensureProfile"

// Parent Route Protected
export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    // Coba load profile dari cookie (auto login jika cookie valid)
    const ok = await ensureProfileLoaded()

    // Jika gagal → user tidak login → redirect
    if (!ok) {
      throw redirect({
        to: "/login",
      })
    }
  },
})
