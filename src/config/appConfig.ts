const appConfig = {
  env: import.meta.env.VITE_APP_ENV,
  apiUrl: import.meta.env.VITE_API_URL,
  oidc: {
    clientId: import.meta.env.VITE_APP_CLIENT_ID,
    redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
    responseType: import.meta.env.VITE_APP_RESPONSE_TYPE,
    scope: import.meta.env.VITE_APP_SCOPE,
    postLogoutRedirectUri: import.meta.env.VITE_APP_POST_LOGOUT_REDIRECT_URI,
    responseMode: import.meta.env.VITE_APP_RESPONSE_MODE,
    automaticSilentRenew: import.meta.env.VITE_APP_AUTOMATIC_SILENT_RENEW === "true",
    silentRedirectUri: import.meta.env.VITE_APP_SILENT_REDIRECT_URI,
  }
};

export default appConfig;