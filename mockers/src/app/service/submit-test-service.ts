import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitTestService {
  private baseUrl = 'https://l20p1d9fwl.execute-api.ap-south-1.amazonaws.com/dev';

  constructor(
    private http: HttpClient,
    private oidcSecurityService: OidcSecurityService
  ) {}

submitTest(attemptId: string, userId: string): Observable<any> {
  const body = { attemptId, userId };

  return this.getApiToken().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      return this.http.post<any>(`${this.baseUrl}`, body, { headers }).pipe(
        tap(() => {
          localStorage.clear();          
      
        })
      );
    })
  );
}


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
}


