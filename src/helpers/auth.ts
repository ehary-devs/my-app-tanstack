import { useAuthStore } from "@/stores/auth"

// =======================================
// CHECK LOGIN
// =======================================
export function isLoggedIn() {
  return !!useAuthStore.getState().accessToken
}

// =======================================
// CHECK ROLE
// =======================================
export function hasRole(roleName: string) {
  const roles = useAuthStore.getState().roles
  return roles.some(r => r.name === roleName)
}

// =======================================
// CHECK PERMISSION (single)
// =======================================
export function hasPermission(permissionName: string) {
  const permissions = useAuthStore.getState().permissions
  return permissions.some(p => p.name === permissionName)
}

// =======================================
// CHECK MULTIPLE PERMISSION (OR)
// at least one permission exists
// =======================================
export function hasAnyPermission(arr = []) {
  const permissions = useAuthStore.getState().permissions

  return arr.some(name =>
    permissions.some(p => p.name === name)
  )
}

// =======================================
// CHECK MULTIPLE PERMISSION (AND)
// all permissions must exist
// =======================================
export function hasAllPermissions(arr = []) {
  const permissions = useAuthStore.getState().permissions

  return arr.every(name =>
    permissions.some(p => p.name === name)
  )
}

// =======================================
// COMBINED ROLE OR PERMISSION
// =======================================
export function hasAccess({ roles = [], permissions = [] }) {
  const state = useAuthStore.getState()

  const roleValid = roles.length === 0
    ? true
    : roles.some(r =>
        state.roles.some(x => x.name === r)
      )

  const permValid = permissions.length === 0
    ? true
    : permissions.some(p =>
        state.permissions.some(x => x.name === p)
      )

  return roleValid && permValid
}
