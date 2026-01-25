import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) { }

  createRazorpayOrder(
    amount: number,
    username: string
  ): Observable<any> {

    return this.getApiToken().pipe(
      switchMap((token: string) => {

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });

        return this.http.post<any>(
          'https://47hbtrjb0a.execute-api.ap-south-1.amazonaws.com/dev',
          {
            amount,
            username   // 👈 store subscriber identity
          },
          { headers }
        );
      })
    );
  }

  verifySubscriptionPayment(payload: any): Observable<any> {

  return this.getApiToken().pipe(
    switchMap((token: string) => {

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      return this.http.post<any>(
        'https://3r4erfmyn0.execute-api.ap-south-1.amazonaws.com/dev',
        payload,
        { headers }
      );
    })
  );
}



  //  * Fetch a fresh ID Token from Cognito
  getApiToken(): Observable<string> {
    return this.oidcSecurityService.getIdToken().pipe(
      map((idToken: string) => {
        if (!idToken) {
          throw new Error('No ID Token available. Please login again.');
        }
        return idToken;
      })
    )
  }

}

