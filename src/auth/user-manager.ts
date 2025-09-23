import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts'
import type { AppUser } from '@/types/app-user'
import { toAppUser } from '@/types/app-user'
import { config } from '@/config'

const oidcSettings = {
  authority: config.api.baseUrl + '/identity',
  client_id: config.auth.oidc.clientId,
  redirect_uri: config.auth.oidc.redirectUri,
  response_type: config.auth.oidc.responseType,
  scope: config.auth.oidc.scope,
  post_logout_redirect_uri: config.auth.oidc.postLogoutRedirectUri,
  response_mode: config.auth.oidc.responseMode as 'query' | 'fragment' | undefined,
  automaticSilentRenew: config.auth.oidc.automaticSilentRenew,
  silent_redirect_uri: config.auth.oidc.silentRedirectUri,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
}

const userManager = new UserManager(oidcSettings)

export const getCurrentUser = async (): Promise<AppUser | null> => {
  const user = await userManager.getUser()
  return toAppUser(user)
}

export const login = (): Promise<void> => {
  return userManager.signinRedirect()
}

export const logout = (): Promise<void> => {
  return userManager.signoutRedirect()
}

export const getUser = async (): Promise<AppUser | null> => {
  const user = await userManager.getUser()
  return toAppUser(user)
}

export const handleLoginCallback = (): Promise<User> => {
  return userManager.signinRedirectCallback()
}

// Export the userManager if you need to access it directly
export default userManager
