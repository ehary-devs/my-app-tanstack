import type { Role, Permission } from "./authorization"

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
    deletedAt: string | null
    roles: Role[]
    permissions: Permission[]
}
  
export interface UsersSearchParams {
    page?: number
    perPage?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    search?: string
}