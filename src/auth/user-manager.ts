import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts'
import type { AppUser } from '@/types/app-user'
import { toAppUser } from '@/types/app-user'
import type { CultureText } from '@/types'
import { CULTURE_TEXT } from '@/types'
import { config } from '@/config'

const oidcSettings = {
  authority: config.api.baseUrl + '/identity',
  client_id: config.auth.oidc.clientId,
  redirect_uri: config.auth.oidc.redirectUri,
  response_type: config.auth.oidc.responseType,
  scope: config.auth.oidc.scope,
  post_logout_redirect_uri: config.auth.oidc.postLogoutRedirectUri,
  response_mode: config.auth.oidc.responseMode as 'query' | 'fragment' | undefined,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
}

const userManager = new UserManager(oidcSettings)

// Helper: persist an updated user object into the same WebStorageStateStore
// used by the UserManager so the library's getUser() returns the rotated tokens.
export async function storeUpdatedUser(appUser: AppUser): Promise<void> {
  try {
    const authority = String(oidcSettings.authority)
    const clientId = String(oidcSettings.client_id)

    // The oidc-client-ts WebStorageStateStore prepends its own prefix (usually 'oidc.')
    // to keys passed into set(). The library expects a key of the form
    //   'user:{authority}:{clientId}'
    // and will store it as 'oidc.user:{authority}:{clientId}'. If we write a key
    // that already includes the 'oidc.' prefix (for example 'oidc.user:...') the
    // store implementation will add another 'oidc.' resulting in a double-prefixed
    // key like 'oidc.oidc.user:...'. To avoid creating duplicates, pass the base
    // key (without the 'oidc.' prefix) to store.set().
    const storageKeyBase = `user:${authority}:${clientId}`

    // Access the configured userStore (fall back to a localStorage store)
    // The UserManager exposes its settings via userManager.settings
    const store = (userManager.settings?.userStore ?? new WebStorageStateStore({ store: window.localStorage })) as WebStorageStateStore

    // WebStorageStateStore expects set(key, value) where it will prefix the key.
    await store.set(storageKeyBase, JSON.stringify(appUser))

    // Cleanup: remove any accidentally created double-prefixed key from older runs.
    try {
      const doublePrefixed = `oidc.oidc.user:${authority}:${clientId}`
      if (window?.localStorage?.getItem(doublePrefixed)) {
        window.localStorage.removeItem(doublePrefixed)
      }
    } catch {
      // ignore localStorage access errors
    }
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
export const login = async (): Promise<void> => {
  try {
    // Use history.replaceState to avoid adding an extra entry if already on a transient route,
    // then push a known internal transition state so Back returns into the SPA.
    // We choose '/' as the transition path since it's the Default.vue route that handles auth gracefully.
    const transitionPath = '/'
    if (window && window.history && window.location) {
      // Only push if the current location isn't already the transition path.
      if (window.location.pathname !== transitionPath) {
        window.history.pushState({}, '', transitionPath)
      }
    }
  } catch {
    // ignore — best-effort history manipulation
  }

  // Get current locale from i18n
  const i18n = (await import('@/i18n')).default
  const currentCulture = i18n.global.locale.value as CultureText || CULTURE_TEXT.VIETNAMESE

  const extraArgs = {
    extraQueryParams: {
      culture: currentCulture
    }
  }

  return userManager.signinRedirect(extraArgs)
}

export const logout = (redirectTo?: string, useState = true): Promise<void> => {
  const defaultPostLogout = config.auth.oidc.postLogoutRedirectUri

  // Best-effort: push an internal transition entry so Back doesn't go to the IdP URL.
  try {
    const transitionPath = '/'
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
