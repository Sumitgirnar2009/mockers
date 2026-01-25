import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, map, switchMap } from 'rxjs';

export interface SubscriptionResponse {
  success: boolean;
  username: string;
  isPremium: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CheckSubscription {

  private readonly API_URL =
    'https://nktpd2sp9h.execute-api.ap-south-1.amazonaws.com/dev';

  constructor(
    private http: HttpClient,
    private oidcSecurityService: OidcSecurityService
  ) {}

  /**
   * Fetch ID token from Cognito
   */
  private getApiToken(): Observable<string> {
    return this.oidcSecurityService.getIdToken().pipe(
      map((idToken: string) => {
        if (!idToken) {
          throw new Error('No ID Token available. Please login again.');
        }
        return idToken;
      })
    );
  }

  /**
   * Check if user is premium/subscribed
   */
  checkUserSubscription(username: string): Observable<boolean> {
    return this.getApiToken().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<SubscriptionResponse>(
          this.API_URL,
          { username },
          { headers }
        );
      }),
      map(response => response.isPremium)
    );
  }
}
