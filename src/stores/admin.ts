import type { Admin, CreateAdminRequest, GetAdminsParams, Pagination } from '@/types'
import { Status } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAppStore } from './app'

export const useAdminStore = defineStore('admin', () => {
  // State
  const createdAdmin = ref<Admin | null>(null)
  // List of admins and pagination returned from the API
  const admins = ref<Admin[]>([])
  const pagination = ref<Pagination | null>(null)

  const setCreatedAdmin = (admin: Admin | null) => {
    createdAdmin.value = admin
  }

  const setAdmins = (data: Admin[]) => {
    admins.value = data
  }

  const createAdmin = async (adminData: CreateAdminRequest) => {
    const appStore = useAppStore()

    try {
      // Show loading state
      appStore.setLoading(true)
      setCreatedAdmin(null)

      const response = await adminService.createAdmin(adminData)

      // Create an Admin object following the API shape (canonical)
      const admin: Admin = {
        id: response.id,
        username: response.email ?? response.id,
        fullName: response.fullName,
        email: response.email,
        status: response.isActive ? Status.Active : Status.Inactive,
        isSystemAdmin: response.isSystemAdmin,
        createdAt: response.createdAt,
        lastLoginAt: response.lastLoginAt,
        updatedAt: response.updatedAt ?? undefined,
        avatarUrl: response.avatarUrl ?? null,
      }

      setCreatedAdmin(admin)
      setAdmins([admin, ...admins.value]) // Add to the start of the list
      return admin
    } finally {
      // Hide loading state
      appStore.setLoading(false)
    }
  }

  /**
   * Fetch paginated admin list from backend and update state
   */
  const fetchAdmins = async (params?: GetAdminsParams) => {
    const appStore = useAppStore()
    try {
      appStore.setLoading(true)
      const response = await adminService.getAdmins(params)
      // Response contains API-shaped Admin objects; store them directly
      const apiAdmins = response?.admins || []
      admins.value = apiAdmins as Admin[]

      pagination.value = response?.pagination || null
      return response
    } finally {
      appStore.setLoading(false)
    }
  }

  const clearState = () => {
    setCreatedAdmin(null)
  }

  return {
    // State
    createdAdmin,
    admins,
    pagination,
    // Actions
    setCreatedAdmin,
    createAdmin,
    fetchAdmins,
    clearState,
  }
})
