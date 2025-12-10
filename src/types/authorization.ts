export interface Role {
    uuid: string
    name: string
    description: string
    isActive: boolean
    permissionsCount: number
    createdAt: string
    updatedAt: string
}
  
export interface Permission {
    uuid: string
    name: string
    description: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}