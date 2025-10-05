import { Component, signal, effect } from '@angular/core';
import { UserService } from '../../../service/logged-in-user-service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { DatePipe, JsonPipe, NgClass, NgForOf, NgIf, TitleCasePipe } from '@angular/common';

interface Attempt {
  attemptId: string;
  status: string;
  startDate: string;
  endDate?: string;
  score?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-home-analysis',
  imports: [JsonPipe, NgIf, NgForOf, TitleCasePipe, NgClass, DatePipe],
  templateUrl: './home-analysis.html',
  styleUrl: './home-analysis.css'
})
export class HomeAnalysis {

  username!: string;
  quizId!: string | null;
  attempts = signal<Attempt[]>([]);
  isLoggedIn = signal<boolean>(false);
  inProgress = signal<boolean>(false);

  private readonly attemptsUrl = 'https://3xwi0sy6xk.execute-api.ap-south-1.amazonaws.com/dev1';

  constructor(
    private userService: UserService,
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get quizId from route
    this.quizId = this.route.snapshot.paramMap.get('quizId');
    console.log('📌 Quiz ID:', this.quizId);

    // Reactive effect inside constructor (allowed)
    effect(() => {
      const user = this.userService.user();
      if (user && this.quizId) {
        this.username = user.username;
        this.isLoggedIn.set(true);
        console.log('✅ Logged in as:', this.username);
        this.loadAttempts();
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

private loadAttempts(): void {
  if (!this.username || !this.quizId) return;

  this.getApiToken().pipe(
    switchMap(token => {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const params = new HttpParams()
        .set('username', this.username)
        .set('quizId', this.quizId ?? '');

      return this.http.get<{ attempts: Attempt[], inProgress: boolean }>(this.attemptsUrl, { headers, params });
    }),
    map(response => {
      let attempts = response.attempts || [];

      // Sort descending by startTime
      attempts.sort((a, b) => Date.parse(b['startTime']) - Date.parse(a['startTime']));

      // Add attempt number (latest attempt gets highest number)
      const totalAttempts = attempts.length;
      attempts = attempts.map((attempt, index) => ({
        ...attempt,
        attemptNo: totalAttempts - index // Latest attempt gets highest number
      }));

      this.attempts.set(attempts);
      this.inProgress.set(response.inProgress);

      console.log('📌 Attempts (sorted + numbered):', attempts);
    })
  ).subscribe({
    next: () => console.log('✅ Attempts loaded successfully'),
    error: err => console.error('❌ Error fetching attempts:', err)
  });
}


  private getApiToken(): Observable<string> {
    return this.oidcSecurityService.getIdToken().pipe(
      map((idToken: string) => {
        if (!idToken) throw new Error('No ID Token available. Please login again.');
        return idToken;
      })
    );
  }
}
