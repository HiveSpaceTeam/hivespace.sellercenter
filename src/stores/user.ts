import type { UserData, UserListParams } from '@/services/user.service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<UserData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function setUsers(userList: UserData[]) {
    users.value = userList
  }

  function removeUser(userId: string) {
    const index = users.value.findIndex((user) => user.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  function updateUserInList(updatedUser: UserData) {
    const index = users.value.findIndex((user) => user.id === updatedUser.id)
    if (index !== -1) {
      users.value[index] = updatedUser
    }
  }

  async function fetchUsers(params?: UserListParams) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      const response = await userService.getUsers(params)
      setUsers(response.users)
      return response
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users')
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(userId: string) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      await userService.deleteUser(userId)
      removeUser(userId)
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function activateUser(userId: string) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      const updatedUser = await userService.activateUser(userId)
      updateUserInList(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Error activating user:', error)
      setError('Failed to activate user')
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function deactivateUser(userId: string) {
    setLoading(true)
    setError(null)
    try {
      const { userService } = await import('@/services/user.service')
      const updatedUser = await userService.deactivateUser(userId)
      updateUserInList(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Error deactivating user:', error)
      setError('Failed to deactivate user')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    users,
    isLoading,
    error,
    // Actions
    setLoading,
    setError,
    setUsers,
    removeUser,
    updateUserInList,
    fetchUsers,
    deleteUser,
    activateUser,
    deactivateUser,
  }
})
