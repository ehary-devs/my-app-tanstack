export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T[]
    meta: {
      page: number
      perPage: number
      total: number
      totalPages: number
    }
}

export type { UsersSearchParams, User } from './users'
export type { Role, Permission } from './authorization'