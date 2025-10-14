import { User, UserManager, WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts'
import type { AppUser } from '@/types/app-user'
import { toAppUser } from '@/types/app-user'
import { config } from '@/config'

// Types
type RedirectArgs = {
  redirectTo?: string
  useState?: boolean
}

interface IdTokenProfile {
  sub: string
  iss: string
  aud: string | string[]
  exp: number
  iat: number
  role?: string | string[]
  [key: string]: unknown
}

type UserData = {
  id_token: string | undefined
  session_state: string | null
  access_token: string
  refresh_token: string | undefined
  token_type: 'Bearer'
  scope: string
  profile: IdTokenProfile
  expires_at: number | undefined
}

// Constants
const TRANSITION_PATH = '/auth/transition'
const LOCAL_STORAGE_KEY = 'hivespace.user_cache'
const USER_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// OIDC Configuration
const oidcSettings: UserManagerSettings = {
  authority: `${config.api.baseUrl}/identity`,
  client_id: config.auth.oidc.clientId,
  redirect_uri: config.auth.oidc.redirectUri,
  response_type: config.auth.oidc.responseType,
  scope: config.auth.oidc.scope,
  post_logout_redirect_uri: config.auth.oidc.postLogoutRedirectUri,
  response_mode: config.auth.oidc.responseMode as 'query' | 'fragment' | undefined,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // Additional recommended settings
  monitorSession: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
}

// UserManager instance
const userManager = new UserManager(oidcSettings)

// User cache for performance
let userCache: { user: AppUser | null; timestamp: number } | null = null

// Utility Functions
const clearUserCache = (): void => {
  userCache = null
}

const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < USER_CACHE_DURATION
}

const handleHistoryTransition = (): void => {
  try {
    if (window?.history && window?.location && window.location.pathname !== TRANSITION_PATH) {
      window.history.pushState({}, '', TRANSITION_PATH)
    }
  } catch (error) {
    console.debug('History manipulation failed', error)
  }
}

const createOIDCUser = (userData: UserData): User => {
  return new User({
    id_token: userData.id_token,
    session_state: userData.session_state,
    access_token: userData.access_token,
    refresh_token: userData.refresh_token,
    token_type: userData.token_type,
    scope: userData.scope,
    profile: userData.profile,
    expires_at: userData.expires_at,
  })
}

// Event Handlers
userManager.events.addUserLoaded(() => clearUserCache())
userManager.events.addUserUnloaded(() => clearUserCache())
userManager.events.addAccessTokenExpiring(() => clearUserCache())

// Main Functions
export async function storeUpdatedUser(user: AppUser | User): Promise<void> {
  try {
    if (user instanceof User) {
      await userManager.storeUser(user)
      return
    }

    const appUser = user as AppUser
    const userData: UserData = {
      id_token: appUser.id_token,
      session_state: null,
      access_token: appUser.access_token,
      refresh_token: appUser.refresh_token,
      token_type: 'Bearer',
      scope: config.auth.oidc.scope,
      profile: appUser.profile || {},
      expires_at: appUser.expires_at,
    }

    const oidcUser = createOIDCUser(userData)
    await userManager.storeUser(oidcUser)
    clearUserCache()
  } catch (error) {
    console.error('Failed to store updated user:', error)
    // Store in localStorage as fallback
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user))
    } catch {
      console.error('Failed to store user in localStorage')
    }
  }
}

export const getCurrentUser = async (): Promise<AppUser | null> => {
  // Check cache first
  if (userCache && isCacheValid(userCache.timestamp)) {
    return userCache.user
  }

  try {
    const user = await userManager.getUser()
    const appUser = toAppUser(user)

    // Update cache
    userCache = {
      user: appUser,
      timestamp: Date.now(),
    }

    return appUser
  } catch (error) {
    console.error('Failed to get current user:', error)
    clearUserCache()
    return null
  }
}

export const login = async (): Promise<void> => {
  handleHistoryTransition()
  try {
    await userManager.signinRedirect()
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export const logout = async ({ redirectTo, useState = true }: RedirectArgs = {}): Promise<void> => {
  handleHistoryTransition()
  clearUserCache()

  const args: Record<string, unknown> = {
    post_logout_redirect_uri: config.auth.oidc.postLogoutRedirectUri,
  }

  if (redirectTo) {
    args[useState ? 'state' : 'post_logout_redirect_uri'] = useState ? { redirectTo } : redirectTo
  }

  try {
    await userManager.signoutRedirect(args)
  } catch (error) {
    console.error('Logout failed:', error)
    throw error
  }
}

export const handleLoginCallback = async (): Promise<User> => {
  try {
    const user = await userManager.signinRedirectCallback()
    clearUserCache()
    return user
  } catch (error) {
    console.error('Login callback failed:', error)
    throw error
  }
}

// Utility exports
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user && !user.expired
}

export const hasValidToken = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user?.access_token && !user.expired
}

// Export the userManager if direct access is needed
export default userManager
