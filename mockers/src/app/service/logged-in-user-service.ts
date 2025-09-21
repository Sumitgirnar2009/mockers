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
    // Subscribe to userData$
    this.oidcSecurityService.userData$.subscribe(({ userData }) => {
      this.user.set(userData);
      console.log('User Data from userData$:', userData);
    });

    // Subscribe to isAuthenticated$
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated.set(isAuthenticated);
      console.log('Is Authenticated from isAuthenticated$:', isAuthenticated);
    });

    // Check authentication on service init
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken,idToken }) => {
      console.log('Authenticated (checkAuth):', isAuthenticated);
      console.log('User Data (checkAuth):', userData);
      console.log('Access Token (checkAuth):', accessToken);
      console.log('id Token (checkAuth):', idToken);

      // Update signals if needed
      this.user.set(userData);
      this.isAuthenticated.set(isAuthenticated);


    });


 


  }

  getUser() {
    return this.user();
  }

  getIsAuthenticated() {
    return this.isAuthenticated();
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    window.location.href = "https://ap-south-18nwzrk7h3.auth.ap-south-1.amazoncognito.com/logout?client_id=99k2hi7sg439ftqdp3imf3ru&logout_uri=<logout uri>";
  }
}
