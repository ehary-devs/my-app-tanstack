import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppAdmin } from '@/components/app-admin'
import { hasPermission, hasRole } from "@/helpers/auth"
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Shield, Activity, TrendingUp } from 'lucide-react'

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
  const user = useAuthStore(s => s.user)
  const roles = useAuthStore(s => s.roles)
  const permissions = useAuthStore(s => s.permissions)
  const isAdmin = hasRole("admin") || hasRole("Admin") || hasRole("ADMIN")
  
  const adminStats = [
    {
      title: "Total Roles",
      value: roles.length,
      description: "Roles assigned to your account",
      icon: Shield,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Permissions",
      value: permissions.length,
      description: "Permissions you have access to",
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Account Status",
      value: user?.isActive ? "Active" : "Inactive",
      description: "Your account status",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Trusted Author",
      value: user?.isTrustedAuthor ? "Yes" : "No",
      description: "Trusted author status",
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName} {user?.lastName}! 👋
        </h1>
        <p className="text-muted-foreground">
          {isAdmin 
            ? "Here's what's happening with your account today."
            : "Welcome to your dashboard."
          }
        </p>
      </div>

      {/* Admin Stats Grid - Only for Admin */}
      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* User Info Card */}
      <div className={`grid gap-4 ${isAdmin ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Username</span>
              <span className="text-sm">{user?.username}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Full Name</span>
              <span className="text-sm">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Account Status</span>
              <span className="text-sm">{user?.isActive ? "Active" : "Inactive"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Roles & Permissions Card - Only for Admin */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Your assigned roles and available permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Roles ({roles.length})</span>
                <div className="flex flex-wrap gap-2">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {role.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Permissions ({permissions.length})</span>
                <p className="text-sm text-muted-foreground">
                  You have access to {permissions.length} permission{permissions.length !== 1 ? 's' : ''} across all your roles.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}