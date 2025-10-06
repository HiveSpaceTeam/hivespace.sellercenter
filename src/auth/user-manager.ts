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
  userStore: new WebStorageStateStore({ store: window.localStorage }),
}

const userManager = new UserManager(oidcSettings)

// Helper: persist an updated user object into the same WebStorageStateStore
// used by the UserManager so the library's getUser() returns the rotated tokens.
export async function storeUpdatedUser(user: User): Promise<void> {
  try {
    // Persist the full OIDC User (including tokens/metadata) in the configured store
    await userManager.storeUser(user)
  } catch (err) {
    // Best-effort; do not throw. Log for diagnostics.
    console.error('storeUpdatedUser failed', err)
  }
}

export const getCurrentUser = async (): Promise<AppUser | null> => {
  const user = await userManager.getUser()
  return toAppUser(user)
}

// Ensure we push a safe in-app history entry before navigating to the IdP.
// This prevents the browser Back button from landing on the IdP URL or error pages.
export const login = (): Promise<void> => {
  // try {
  //   // Use history.replaceState to avoid adding an extra entry if already on a transient route,
  //   // then push a known internal transition state so Back returns into the SPA.
  //   // We choose '/auth/transition' as a lightweight internal route that the app can handle.
  //   const transitionPath = '/auth/transition'
  //   if (window && window.history && window.location) {
  //     // Only push if the current location isn't already the transition path.
  //     if (window.location.pathname !== transitionPath) {
  //       window.history.pushState({}, '', transitionPath)
  //     }
  //   }
  // } catch {
  //   // ignore — best-effort history manipulation
  // }

  return userManager.signinRedirect()
}

export const logout = (redirectTo?: string, useState = true): Promise<void> => {
  const defaultPostLogout = config.auth.oidc.postLogoutRedirectUri

  // Best-effort: push an internal transition entry so Back doesn't go to the IdP URL.
  try {
    const transitionPath = '/auth/transition'
    if (window && window.history && window.location) {
      if (window.location.pathname !== transitionPath) {
        window.history.pushState({}, '', transitionPath)
      }
    }
  } catch {
    // ignore
  }

  const args: Record<string, unknown> = {
    post_logout_redirect_uri: defaultPostLogout,
  }
  if (redirectTo) {
    // If useState is true, put the SPA route in state so the callback can
    // navigate internally. Otherwise try to set a post_logout_redirect_uri.
    if (useState) {
      args.state = { redirectTo }
    } else {
      args.post_logout_redirect_uri = redirectTo
    }
  }

  return userManager.signoutRedirect(args)
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
