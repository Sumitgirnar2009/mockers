// auth/auth.config.ts
import { OpenIdConfiguration } from 'angular-auth-oidc-client';

// Determine current environment
const isProduction = window.location.hostname !== 'localhost';

// Environment-specific redirect URLs
const getRedirectUrl = (): string => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost') {
    return 'http://localhost:4200/';
  } else if (hostname === 'www.crackcet.in' || hostname === 'crackcet.in') {
    return 'https://www.crackcet.in/';
  } else if (hostname === 'www.sumitgirnar.xyz' || hostname === 'sumitgirnar.xyz') {
    return 'https://www.sumitgirnar.xyz/';
  } else {
    // Fallback for other domains
    return `https://${hostname}/`;
  }
};

export const authConfig: OpenIdConfiguration = {
  authority: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_8nWZrk7h3',
  redirectUrl: getRedirectUrl(),
  clientId: '99k2hi7sg439ftqdp3imf3ru',
  scope: 'email openid phone profile offline_access',
  responseType: 'code',
  silentRenew: true,
  useRefreshToken: true,
  autoUserInfo: true,
  logLevel: isProduction ? 0 : 1, // Verbose logging in dev, none in prod
};

// Export Cognito Hosted UI domain for registration/password reset
export const cognitoHostedUIDomain = 'https://ap-south-18nwzrk7h3.auth.ap-south-1.amazoncognito.com';