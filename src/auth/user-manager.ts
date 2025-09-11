import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type { AppUser } from '@/types/app-user'
import { toAppUser } from '@/types/app-user'
import appConfig from '@/config/appConfig';

const oidcSettings = {
    authority: appConfig.apiUrl + '/identity',
    client_id: appConfig.oidc.clientId,
    redirect_uri: appConfig.oidc.redirectUri,
    response_type: appConfig.oidc.responseType,
    scope: appConfig.oidc.scope,
    post_logout_redirect_uri: appConfig.oidc.postLogoutRedirectUri,
    response_mode: appConfig.oidc.responseMode,
    automaticSilentRenew: appConfig.oidc.automaticSilentRenew,
    silent_redirect_uri: appConfig.oidc.silentRedirectUri,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const userManager = new UserManager(oidcSettings);

export const getCurrentUser = async (): Promise<AppUser | null> => {
  const user = await userManager.getUser();
  return toAppUser(user)
}

export const login = (): Promise<void> => {
  return userManager.signinRedirect();
};

export const logout = (): Promise<void> => {
  return userManager.signoutRedirect();
};

export const getUser = async (): Promise<AppUser | null> => {
  const user = await userManager.getUser();
  return toAppUser(user)
};

export const handleLoginCallback = (): Promise<User> => {
  return userManager.signinRedirectCallback();
};

// Export the userManager if you need to access it directly
export default userManager;
