import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable, switchMap, tap } from 'rxjs';


export interface Attempt {
  username: string;
  attemptId: string;
  quizId: string;
  startTime: string;
  endTime: string | null;
  status: 'inprogress' | 'completed';
  physicsMarks: number;
  chemistryMarks: number;
  mathsMarks: number;
  totalMarks: number;
}
@Injectable({ providedIn: 'root' })

export class HandleAttemptId {
  private _attempt = signal<Attempt | null>(null);
  readonly attempt = this._attempt.asReadonly();

  constructor(private http: HttpClient,private oidcSecurityService: OidcSecurityService) {}
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

 getOrCreateActiveAttempt(username: string, quizId: string): Observable<Attempt> {
  return this.getApiToken().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      return this.http.post<Attempt>(
        'https://3xwi0sy6xk.execute-api.ap-south-1.amazonaws.com/dev1',
        { username, quizId },
        { headers }
      );
    }),
    tap(res => {
      this._attempt.set(res);
      console.log(
        res.status === 'inprogress'
          ? `Resuming attempt ${res.attemptId}`
          : `Created new attempt ${res.attemptId}`
      );
    })
  );
}

  

}
