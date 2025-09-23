
import type { Pagination } from '@/types'
export interface CreateAdminRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  isSystemAdmin: boolean
}

export interface CreateAdminResponse {
  id: string
  fullName: string
  email: string
  isSystemAdmin: boolean
  createdAt: string
  isActive: boolean
  lastLoginAt?: string
  updatedAt?: string
  avatarUrl?: string
}

export enum Status {
  Inactive = 0,
  Active = 1,
}

export enum StatusFilter {
  All = -1,
  Inactive = 0,
  Active = 1,
}

// Role filter enum matching backend role definitions
export enum RoleFilter {
  All = -1,
  Customer = 0,
  Seller = 1,
  RegularAdmin = 2,
  SystemAdmin = 3,
}

export interface Admin {
  id: string
  username: string
  fullName: string
  email: string
  status: Status
  isSystemAdmin: boolean
  createdAt: string
  updatedAt?: string | null
  lastLoginAt?: string | null
  avatarUrl?: string | null
}

// Query params for GET /admins
export interface GetAdminsParams {
  page?: number
  pageSize?: number
  role?: number
  status?: number
  searchTerm?: string
  sort?: string
}

// Response shape for GET /admins
export interface GetAdminsResponse {
  admins: Admin[]
  pagination: Pagination
}
