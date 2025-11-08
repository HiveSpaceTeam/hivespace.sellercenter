import {
    type UserSettings,
    type CultureText,
    type ThemeText,
    DEFAULT_USER_SETTINGS,
    numericToStringCulture,
    numericToStringTheme,
} from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services/user.service'
import { useAppStore } from './app'

export const useUserStore = defineStore('user', () => {
    // User settings state
    const userSettings = ref<UserSettings>(DEFAULT_USER_SETTINGS)
    // User Settings Actions
    const setUserSettings = (settings: UserSettings) => {
        userSettings.value = settings
    }

    /**
     * Fetch user settings and update state
     */
    const fetchUserSettings = async () => {
        const appStore = useAppStore()
        try {
            appStore.setLoading(true)
            const settings = await userService.getUserSetting()
            setUserSettings(settings)
            return settings
        } catch (error) {
            throw error
        } finally {
            appStore.setLoading(false)
        }
    }

    /**
     * Update user settings
     */
    const updateUserSettings = async (newSettings: UserSettings) => {
        const appStore = useAppStore()
        try {
            appStore.setLoading(true)
            await userService.setUserSetting(newSettings)
            setUserSettings(newSettings) // Update local state on success
        } catch (error) {
            throw error
        } finally {
            appStore.setLoading(false)
        }
    }

    /**
     * Update theme setting and sync with DOM
     * @param themeValue - THEME_VALUES.LIGHT for Light, THEME_VALUES.DARK for Dark
     */
    const updateTheme = async (themeValue: number) => {
        const newSettings = { ...userSettings.value, theme: themeValue }
        await updateUserSettings(newSettings)
    }

    /**
     * Update culture setting and sync with i18n
     * @param cultureValue - CULTURE_VALUES.VIETNAMESE for Vietnamese, CULTURE_VALUES.ENGLISH for English
     */
    const updateCulture = async (cultureValue: number) => {
        const newSettings = { ...userSettings.value, culture: cultureValue }
        await updateUserSettings(newSettings)

        // Sync with i18n locale using conversion method
        const i18n = (await import('@/i18n')).default
        const culture = numericToStringCulture(cultureValue)
        i18n.global.locale.value = culture
    }

    /**
     * Get current culture as string ('vi'|'en')
     */
    const getCurrentCulture = (): CultureText => {
        return numericToStringCulture(userSettings.value.culture)
    }

    /**
     * Get current theme as string ('light'|'dark')
     */
    const getCurrentTheme = (): ThemeText => {
        return numericToStringTheme(userSettings.value.theme)
    }

    return {
        // User Settings State  
        userSettings,
        // User Settings Actions
        setUserSettings,
        fetchUserSettings,
        updateUserSettings,
        updateTheme,
        updateCulture,
        getCurrentCulture,
        getCurrentTheme,
    }
})
