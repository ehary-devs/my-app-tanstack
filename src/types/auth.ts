export interface Permission {
  id: number
  uuid: string
  name: string
  description: string
  isActive: boolean
  createdAt: unknown
  updatedAt: unknown
}

export interface Role {
  id: number
  uuid: string
  name: string
  description: string
  isActive: boolean
  createdAt: unknown
  updatedAt: unknown
  permissions?: Permission[]
}

export interface Profile {
  id: number
  uuid: string
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  isActive: boolean
  isTrustedAuthor: boolean
  failedLoginAttempts: number
  lockedUntil: string | null
  resetPasswordToken: string | null
  resetPasswordExpires: string | null
  createdAt: unknown
  updatedAt: unknown
  deletedAt: string | null
  roles?: Role[]
  permissions?: Permission[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user?: {
    id: number
    email: string
    username: string
    firstName: string
    lastName: string
  }
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthStore {
  accessToken: string | null
  refreshToken: string | null
  user: Profile | null
  roles: Role[]
  permissions: Permission[]
  isLoadingProfile: boolean
  setTokens: (accessToken: string | null, refreshToken: string | null) => void
  setProfile: (profile: Profile) => void
  logout: () => void
  login: (email: string, password: string) => Promise<boolean>
  fetchProfile: () => Promise<Profile | undefined>
  refreshAccessToken: () => Promise<string | null>
}

