import {
    type GetUserSettingResponse,
    type SetUserSettingRequest,
} from '@/types'
import { apiService } from './api'
import { buildApiUrl } from '@/config'

// User API endpoints
const USER_ENDPOINTS = {
    USER_SETTINGS: '/users/settings', // User settings endpoint
} as const

// User service class
class UserService {
    /**
     * Get user settings
     */
    async getUserSetting(): Promise<GetUserSettingResponse> {
        const url = buildApiUrl(USER_ENDPOINTS.USER_SETTINGS)
        return await apiService.get<GetUserSettingResponse>(url)
    }

    /**
     * Set user settings (returns 204 on success)
     */
    async setUserSetting(settingsData: SetUserSettingRequest): Promise<void> {
        const url = buildApiUrl(USER_ENDPOINTS.USER_SETTINGS)
        await apiService.put<void>(url, settingsData)
    }
}

// Create and export the user service instance
export const userService = new UserService()
