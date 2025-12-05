import type { Role } from "./auth"
import type { Permission } from "./auth"

export interface User {
    uuid: string
    firstName: string
    lastName: string
    email: string
    username: string
    isActive: boolean
    isTrustedAuthor: boolean
    createdAt: string
    updatedAt: string
    roles: Role[]
    permissions: Permission[]
}
  