import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppAdmin } from '@/components/app-admin'
import { hasPermission } from "@/helpers/auth"

const breadcrumb = [
  {
    title: 'Dashboard',
    url: '/dashboard',
  },
]

export const Route = createFileRoute('/_protected/dashboard/')({
  beforeLoad: () => {
    if (!hasPermission("dashboard.view")) {
      throw redirect({ to: "/403" })
    }
  },
  component: () => (
    <AppAdmin breadcrumb={breadcrumb}>
      <RouteComponent />
    </AppAdmin>
  ),
  head: () => ({
    title: 'Dashboard',
    meta: [
      {
        name: 'description',
        content: 'This is the dashboard page',
      },
    ],
  })
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        This is the dashboard page
      </p>
    </div>
  )
}