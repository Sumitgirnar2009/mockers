// auth/auth.config.ts
import { OpenIdConfiguration } from 'angular-auth-oidc-client';

export const authConfig: OpenIdConfiguration = {
  authority: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_8nWZrk7h3',
  redirectUrl: 'http://localhost:4200/',
  clientId: '99k2hi7sg439ftqdp3imf3ru',
  scope: 'email openid phone',
  responseType: 'code',
  silentRenew: true,
  useRefreshToken: true,
};

   