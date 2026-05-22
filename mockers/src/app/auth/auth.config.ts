// auth/auth.config.ts
import { OpenIdConfiguration } from 'angular-auth-oidc-client';

// ==============================================
// MANUAL CONFIGURATION - Update this when deploying
// ==============================================
// Options:
// 1 = http://localhost:4200/ (Development)
// 2 = https://www.crackcet.in/ (Production)
// 3 = https://www.sumitgirnar.xyz/ (Alternative)
// ==============================================
const ENVIRONMENT = 1; // ← CHANGE THIS NUMBER WHEN DEPLOYING
// ==============================================

// Just redirect URLs mapped to environments
const redirectUrls = {
  1: 'http://localhost:4200/',
  2: 'https://www.crackcet.in/',
  3: 'https://www.sumitgirnar.xyz/',
};

export const authConfig: OpenIdConfiguration = {
  authority: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_8nWZrk7h3',
  redirectUrl: redirectUrls[ENVIRONMENT],
  clientId: '99k2hi7sg439ftqdp3imf3ru',
  scope: 'email openid phone profile',
  responseType: 'code',
  silentRenew: true,
  useRefreshToken: true,
  autoUserInfo: true,
};

// Export Cognito Hosted UI domain for registration/password reset
export const cognitoHostedUIDomain = 'https://ap-south-18nwzrk7h3.auth.ap-south-1.amazoncognito.com';
