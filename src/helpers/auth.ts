import { useAuthStore } from "@/stores/auth"

export function hasRole(roleName: string) {
  return useAuthStore.getState().roles.some(r => r.name === roleName)
}

export function hasPermission(permissionName: string) {
  return useAuthStore.getState().permissions.some(p => p.name === permissionName)
}

export function hasAnyPermission(list: string[]) {
  const perms = useAuthStore.getState().permissions
  return list.some(name => perms.some(p => p.name === name))
}

export function hasAllPermissions(list: string[]) {
  const perms = useAuthStore.getState().permissions
  return list.every(name => perms.some(p => p.name === name))
}

export function hasAccess({
  roles = [],
  permissions = [],
}: {
  roles?: string[]
  permissions?: string[]
}) {
  const state = useAuthStore.getState()

  const roleValid =
    roles.length === 0 ||
    roles.some(r => state.roles.some(x => x.name === r))

  const permValid =
    permissions.length === 0 ||
    permissions.some(p => state.permissions.some(x => x.name === p))

  return roleValid && permValid
}
