// ===============================
// Permission
// ===============================
export interface Permission {
    id: number
    uuid: string
    name: string
    description: string
    isActive: boolean
    createdAt?: string | null
    updatedAt?: string | null
  }
  
  // ===============================
  // Role
  // ===============================
  export interface Role {
    id: number
    uuid: string
    name: string
    description: string
    isActive: boolean
    createdAt?: string | null
    updatedAt?: string | null
    permissions?: Permission[]
  }
  
  // ===============================
  // Profile (bersih + aman)
  // ===============================
  export interface Profile {
    id: number
    uuid: string
    email: string
    username: string
    firstName: string
    lastName: string
    isActive: boolean
    isTrustedAuthor: boolean
  
    // Relationship
    roles?: Role[]
    permissions?: Permission[]
  }
  
  // ===============================
  // Generic API Response
  // ===============================
  export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
  }
  
  // ===============================
  // Login Response (cookie-based)
  // ===============================
  export interface LoginResponse {
    user: {
      id: number
      email: string
      username: string
      firstName: string
      lastName: string
    }
  }
  
  // ===============================
  // Auth Store (cookie-based)
  // ===============================
  export interface AuthStore {
    user: Profile | null
    roles: Role[]
    permissions: Permission[]
    isLoadingProfile: boolean
    hasFetchedProfile: boolean
  
    login: (emailOrUsername: string, password: string) => Promise<boolean>
    fetchProfile: () => Promise<Profile | null>
    logout: () => Promise<void>
  }
  