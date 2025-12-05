import { createFileRoute, redirect } from "@tanstack/react-router"
import { ensureProfileLoaded } from "@/helpers/ensureProfile"

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const ok = await ensureProfileLoaded()

    if (!ok) {
      throw redirect({ to: "/login" })
    }
  },
})
