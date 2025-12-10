import { AppAdmin } from '@/components/app-admin'
import { hasPermission } from "@/helpers/auth"
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useMemo, useState, useRef } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetchJson } from "@/lib/api"
import type { Permission, Role } from "@/types"
import { toast } from "sonner"

const breadcrumb = [
    { title: 'Roles', url: '/roles' },
    { title: 'Settings', url: '/roles/settings/$uuid' },
]

function extractErrorMessage(err: unknown, fallback = "Gagal memperbarui permission") {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : ""
  if (!raw) return fallback
  if (raw.toLowerCase().includes("throttlerexception")) {
    return "Terlalu banyak permintaan, coba lagi beberapa saat."
  }
  return raw
}

// Helper component for checkbox with indeterminate support
function IndeterminateCheckbox({
  checked,
  indeterminate,
  onCheckedChange,
  className,
  ...props
}: {
  checked: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
} & Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange">) {
  const checkboxRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (checkboxRef.current && indeterminate) {
      // Set data attribute for styling
      checkboxRef.current.setAttribute("data-indeterminate", "true")
      // Also set aria-checked to mixed for accessibility
      checkboxRef.current.setAttribute("aria-checked", "mixed")
    } else if (checkboxRef.current) {
      checkboxRef.current.removeAttribute("data-indeterminate")
      checkboxRef.current.removeAttribute("aria-checked")
    }
  }, [indeterminate])

  return (
    <div className="relative">
      <Checkbox
        ref={checkboxRef}
        checked={indeterminate ? false : checked}
        onCheckedChange={onCheckedChange}
        className={className}
        {...props}
      />
      {indeterminate && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-0.5 w-2.5 bg-primary" />
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute(
  '/_protected/(authorization)/roles/(settings)/settings/$uuid',
)({
    beforeLoad: () => {
      if (!hasPermission("role.read")) {
        throw redirect({ to: "/403" })
      }
    },
    component: () => (
      <AppAdmin breadcrumb={breadcrumb}>
        <RouteComponent />
      </AppAdmin>
    ),
    head: () => ({
      title: 'Settings Role',
      meta: [{ name: 'description', content: 'This is the settings role page' }],
    })
})

function RouteComponent() {
  const { uuid } = Route.useParams()
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})
  const queryClient = useQueryClient()

  const { data: roleData, isLoading: isRoleLoading, error: roleError } = useQuery({
    queryKey: ["role", uuid],
    queryFn: async () => {
      const res = await apiFetchJson<{ data: Role & { permissions: Permission[] } }>(
        `/roles/${uuid}`,
      )
      return res.data
    },
    enabled: !!uuid,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["permissions", "settings"],
    queryFn: async () => {
      const res = await apiFetchJson<{ data: Permission[] }>("/permissions?perPage=300")
      return res.data ?? []
    },
  })

  const isFetching = isLoading || isRoleLoading
  const hasError = !!error || !!roleError

  // Reset local selection state when switching roles
  useEffect(() => {
    setSelected({})
    setIsUpdating({})
  }, [uuid])

  const groupedPermissions = useMemo(() => {
    if (!data) return {}
    return data.reduce<Record<string, Permission[]>>((acc, permission) => {
      const groupKey = permission.name?.split(".")?.[0] || "other"
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(permission)
      return acc
    }, {})
  }, [data])

  useEffect(() => {
    if (data) {
      setSelected(() => {
        const next: Record<string, boolean> = {}
        data.forEach((permission) => {
          const isSelected =
            roleData?.permissions?.some((item) => item.uuid === permission.uuid) ?? false
          next[permission.uuid] = isSelected
        })
        return next
      })
    }
  }, [data, roleData])

  const togglePermission = async (permissionId: string) => {
    const nextValue = !selected[permissionId]
    const prevValue = selected[permissionId]

    setSelected((prev) => ({ ...prev, [permissionId]: nextValue }))
    setIsUpdating((prev) => ({ ...prev, [permissionId]: true }))

    try {
      await apiFetchJson(`/roles/${uuid}/permissions/${permissionId}`, {
        method: nextValue ? "POST" : "DELETE",
      })

      // Refresh role data so permissions stay in sync
      queryClient.invalidateQueries({ queryKey: ["role", uuid] })
      // Refresh roles list to reflect permission changes
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      toast.success(
        nextValue
          ? "Permission berhasil ditambahkan ke role"
          : "Permission berhasil dicabut dari role",
      )
    } catch (err) {
      const message = extractErrorMessage(err)

      // Ignore benign errors (duplicate add/remove)
      const isBenignAdd = nextValue && message.toLowerCase().includes("already assigned")
      const isBenignRemove = !nextValue && message.toLowerCase().includes("not assigned")

      if (isBenignAdd || isBenignRemove) {
        // Keep the intended state, but clear updating flag
        setSelected((prev) => ({ ...prev, [permissionId]: nextValue }))
      } else {
        // Revert selection on failure
        setSelected((prev) => ({ ...prev, [permissionId]: prevValue }))
        toast.error(message)
      }
    } finally {
      setIsUpdating((prev) => ({ ...prev, [permissionId]: false }))
    }
  }

  // Check if all permissions are selected
  const allSelected = useMemo(() => {
    if (!data) return false
    const activePermissions = data.filter((p) => p.isActive)
    return activePermissions.length > 0 && activePermissions.every((p) => selected[p.uuid])
  }, [data, selected])

  // Check if some permissions are selected (for indeterminate state)
  const someSelected = useMemo(() => {
    if (!data) return false
    const activePermissions = data.filter((p) => p.isActive)
    const selectedCount = activePermissions.filter((p) => selected[p.uuid]).length
    return selectedCount > 0 && selectedCount < activePermissions.length
  }, [data, selected])

  const totalSelectedCount = useMemo(() => {
    if (!data) return 0
    return data.filter((p) => p.isActive && selected[p.uuid]).length
  }, [data, selected])

  const totalActiveCount = useMemo(() => {
    if (!data) return 0
    return data.filter((p) => p.isActive).length
  }, [data])

  // Check if all permissions in a group are selected
  const isGroupAllSelected = (groupPermissions: Permission[]) => {
    const activePermissions = groupPermissions.filter((p) => p.isActive)
    return activePermissions.length > 0 && activePermissions.every((p) => selected[p.uuid])
  }

  // Check if some permissions in a group are selected
  const isGroupSomeSelected = (groupPermissions: Permission[]) => {
    const activePermissions = groupPermissions.filter((p) => p.isActive)
    const selectedCount = activePermissions.filter((p) => selected[p.uuid]).length
    return selectedCount > 0 && selectedCount < activePermissions.length
  }

  const getGroupStats = (groupPermissions: Permission[]) => {
    const activePermissions = groupPermissions.filter((p) => p.isActive)
    const selectedCount = activePermissions.filter((p) => selected[p.uuid]).length
    return { activeCount: activePermissions.length, selectedCount }
  }

  // Toggle all permissions
  const toggleAllPermissions = async () => {
    if (!data) return

    const activePermissions = data.filter((p) => p.isActive)
    if (!activePermissions.length) return

    const shouldSelectAll = !allSelected
    const prevSelected = selected

    // Set all permissions to updating state
    const updatingState: Record<string, boolean> = {}
    activePermissions.forEach((p) => {
      updatingState[p.uuid] = true
    })
    setIsUpdating((prev) => ({ ...prev, ...updatingState }))

    // Optimistically update selection
    setSelected((prev) => {
      const next = { ...prev }
      activePermissions.forEach((p) => {
        next[p.uuid] = shouldSelectAll
      })
      return next
    })

    try {
      // Process all permissions in parallel, tolerate benign errors
      const results = await Promise.allSettled(
        activePermissions.map((p) =>
          apiFetchJson(`/roles/${uuid}/permissions/${p.uuid}`, {
            method: shouldSelectAll ? "POST" : "DELETE",
          }).catch((err) => {
            const message = extractErrorMessage(err, "")
            const lower = message.toLowerCase()
            const isBenignAdd = shouldSelectAll && lower.includes("already assigned")
            const isBenignRemove = !shouldSelectAll && lower.includes("not assigned")
            const isRateLimit =
              lower.includes("terlalu banyak permintaan") ||
              lower.includes("too many requests") ||
              lower.includes("throttlerexception")
            if (isBenignAdd || isBenignRemove) return
            if (isRateLimit) throw new Error(message || "Terlalu banyak permintaan, coba lagi.")
            throw err
          }),
        ),
      )

      const hasFatalError = results.some((r) => r.status === "rejected")

      // Refresh role data so permissions stay in sync
      queryClient.invalidateQueries({ queryKey: ["role", uuid] })
      // Refresh roles list to reflect permission changes
      queryClient.invalidateQueries({ queryKey: ["roles"] })

      if (hasFatalError) {
        setSelected(prevSelected)
        toast.error("Gagal memperbarui sebagian permissions")
      } else {
        toast.success(
          shouldSelectAll
            ? "Semua permission berhasil ditambahkan ke role"
            : "Semua permission berhasil dicabut dari role",
        )
      }
    } catch (err) {
      setSelected(prevSelected)
      const message = err instanceof Error ? err.message : "Gagal memperbarui permissions"
      toast.error(message)
    } finally {
      // Clear updating state
      const clearedState: Record<string, boolean> = {}
      activePermissions.forEach((p) => {
        clearedState[p.uuid] = false
      })
      setIsUpdating((prev) => {
        const next = { ...prev }
        activePermissions.forEach((p) => {
          delete next[p.uuid]
        })
        return next
      })
    }
  }

  // Toggle all permissions in a group
  const toggleGroupPermissions = async (groupPermissions: Permission[]) => {
    const activePermissions = groupPermissions.filter((p) => p.isActive)
    if (!activePermissions.length) return

    const shouldSelectAll = !isGroupAllSelected(groupPermissions)
    const prevSelected = selected

    // Set group permissions to updating state
    const updatingState: Record<string, boolean> = {}
    activePermissions.forEach((p) => {
      updatingState[p.uuid] = true
    })
    setIsUpdating((prev) => ({ ...prev, ...updatingState }))

    // Optimistically update selection
    setSelected((prev) => {
      const next = { ...prev }
      activePermissions.forEach((p) => {
        next[p.uuid] = shouldSelectAll
      })
      return next
    })

    try {
      // Process all permissions in parallel, tolerate benign errors
      const results = await Promise.allSettled(
        activePermissions.map((p) =>
          apiFetchJson(`/roles/${uuid}/permissions/${p.uuid}`, {
            method: shouldSelectAll ? "POST" : "DELETE",
          }).catch((err) => {
            const message = extractErrorMessage(err, "")
            const lower = message.toLowerCase()
            const isBenignAdd = shouldSelectAll && lower.includes("already assigned")
            const isBenignRemove = !shouldSelectAll && lower.includes("not assigned")
            const isRateLimit =
              lower.includes("terlalu banyak permintaan") ||
              lower.includes("too many requests") ||
              lower.includes("throttlerexception")
            if (isBenignAdd || isBenignRemove) return
            if (isRateLimit) throw new Error(message || "Terlalu banyak permintaan, coba lagi.")
            throw err
          }),
        ),
      )

      const hasFatalError = results.some((r) => r.status === "rejected")

      // Refresh role data so permissions stay in sync
      queryClient.invalidateQueries({ queryKey: ["role", uuid] })
      // Refresh roles list to reflect permission changes
      queryClient.invalidateQueries({ queryKey: ["roles"] })

      if (hasFatalError) {
        setSelected(prevSelected)
        toast.error("Gagal memperbarui sebagian permissions")
      } else {
        toast.success(
          shouldSelectAll
            ? "Permission group berhasil ditambahkan ke role"
            : "Permission group berhasil dicabut dari role",
        )
      }
    } catch (err) {
      setSelected(prevSelected)
      const message = extractErrorMessage(err, "Gagal memperbarui permissions")
      toast.error(message)
    } finally {
      // Clear updating state
      setIsUpdating((prev) => {
        const next = { ...prev }
        activePermissions.forEach((p) => {
          delete next[p.uuid]
        })
        return next
      })
    }
  }

  return (
    <div className="py-6 space-y-6">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Settings Role : <span className="text-primary">{roleData?.name}</span></CardTitle>
          <CardDescription>Manage the permissions for the role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
              <p className="font-medium">Tidak dapat memuat data.</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-sm">
                {error && <li>Permissions: {(error as Error).message}</li>}
                {roleError && <li>Role: {(roleError as Error).message}</li>}
              </ul>
            </div>
          )}

          {isFetching && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <Checkbox disabled className="mt-1" />
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isFetching && !hasError && (
            <div className="space-y-3">
              {data?.length ? (
                <>
                  {/* Select All Checkbox */}
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <div className="flex items-start gap-3">
                      <IndeterminateCheckbox
                        aria-label="Pilih semua permission"
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onCheckedChange={toggleAllPermissions}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold leading-none">Pilih Semua</p>
                          <span className="text-xs text-muted-foreground">
                            {totalSelectedCount}/{totalActiveCount} dipilih
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pilih atau batalkan semua permissions sekaligus
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grouped Permissions */}
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([group, permissions]) => {
                        const stats = getGroupStats(permissions)
                        return (
                          <div key={group} className="overflow-hidden rounded-lg border">
                            <div className="flex items-center justify-between gap-3 bg-muted/40 px-3 py-2">
                              <div className="flex items-center gap-2">
                                <IndeterminateCheckbox
                                  aria-label={`Pilih semua permission ${group}`}
                                  checked={isGroupAllSelected(permissions)}
                                  indeterminate={
                                    isGroupSomeSelected(permissions) && !isGroupAllSelected(permissions)
                                  }
                                  onCheckedChange={() => toggleGroupPermissions(permissions)}
                                  className="mt-0"
                                />
                                <div>
                                  <p className="text-sm font-semibold uppercase text-muted-foreground">
                                    {group}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {stats.selectedCount}/{stats.activeCount} dipilih
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
                              {permissions
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((permission) => (
                                  <div
                                    key={permission.uuid}
                                    className="flex items-start gap-3 bg-background p-3"
                                  >
                                    <Checkbox
                                      aria-label={`Pilih permission ${permission.name}`}
                                      checked={!!selected[permission.uuid]}
                                      disabled={!!isUpdating[permission.uuid]}
                                      onCheckedChange={() => togglePermission(permission.uuid)}
                                      className="mt-1"
                                    />
                                    <div className="flex flex-1 items-start justify-between gap-3">
                                      <div className="space-y-1">
                                        <p className="font-medium leading-none">{permission.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {permission.description}
                                        </p>
                                      </div>
                                      <Badge variant={permission.isActive ? "default" : "secondary"}>
                                        {permission.isActive ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada permission.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
