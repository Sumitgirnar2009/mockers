// user.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  // Signals for global state
  user = signal<any | null>(null);
  isAuthenticated = signal(false);

  constructor() {
    // Subscribe to userData$ (contains claims from Id token / user info endpoint)
    this.oidcSecurityService.userData$.subscribe(({ userData }) => {
      // Update the user signal with all claims
      this.user.set(userData);
      console.log('User Data from userData$ (all attributes):', userData);
    });

    // Subscribe to isAuthenticated$
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated.set(isAuthenticated);
      console.log('Is Authenticated from isAuthenticated$:', isAuthenticated);
    });

    // Check authentication on service init
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken, idToken }) => {
      console.log('Authenticated (checkAuth):', isAuthenticated);
      console.log('User Data (checkAuth - all attributes):', userData);
      console.log('Access Token (checkAuth):', accessToken);
      console.log('id Token (checkAuth):', idToken);

      // Update signals
      this.user.set(userData);
      this.isAuthenticated.set(isAuthenticated);

      // OPTIONAL: Log individual optional attributes if you know their keys
      const optionalAttrs = ['phone_number', 'picture', 'preferred_username'];
      optionalAttrs.forEach(attr => {
        if (userData && userData[attr]) {
          console.log(`Optional attribute - ${attr}:`, userData[attr]);
        }
      });
    });
  }

  getUser() {
    return this.user();
  }

  getUserSignal() {
    return this.user;
  }

  getIsAuthenticated() {
    return this.isAuthenticated();
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }
  logout(): void {
    // 1. Call OIDC logout
    this.oidcSecurityService.logoff().subscribe();

    // 2. Clear local state
    this.user.set(null);
    this.isAuthenticated.set(false);

    // 3. Clear session storage
    sessionStorage?.clear();

    // 4. Redirect to home
    setTimeout(() => window.location.href = "/", 100);
  }
}


