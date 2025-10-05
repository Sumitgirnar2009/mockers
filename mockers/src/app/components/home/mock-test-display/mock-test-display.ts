import { Component, effect, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../service/logged-in-user-service';
import { Attempt } from '../../../service/handle-attempt-id';
import { QuizRecord } from '../../../models/quiz-record.model';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-mock-test-display',
  imports: [RouterLink, NgClass, NgFor, NgIf],
  templateUrl: './mock-test-display.html',
  styleUrls: ['./mock-test-display.css']
})
export class MockTestDisplay implements OnInit {

  // Quiz IDs
  pcm_fst1_quizId = '37a81c5d-6362-41e4-aaf3-9d925579f538';
  pcm_fst2_quizId = '36a81c5d-6362-41e4-aaf3-9d925579f512';

  // User + Attempt signals
  username!: string;
  attemptId = signal<string>('');
  startTime = signal<string>('');
  attemptModel = signal<Attempt | null>(null);
  isLoggedIn = signal<boolean>(false);

  // Quiz Records
  quizRecords: QuizRecord[] = [
    { quizId: this.pcm_fst1_quizId, quizName: 'PCM FULL SYLLABUS TEST 1', quizType: 'free', isProgress: false, attemptNo: 1 },
    { quizId: this.pcm_fst2_quizId, quizName: 'PCM FULL SYLLABUS TEST 2', quizType: 'free', isProgress: false, attemptNo: 1 }
  ];

  private readonly attemptsUrl = 'https://3xwi0sy6xk.execute-api.ap-south-1.amazonaws.com/dev1';

  constructor(
    private userService: UserService,
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient,
    private router: Router
  ) {
    // Reactively handle user login state
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.username = user.username;
        this.isLoggedIn.set(true);
        console.log('✅ Logged in as:', this.username);
        this.loadQuizAttempts();
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

  ngOnInit(): void {}

  /**
   * Handles quiz start/continue button click
   */
  onQuizAction(quiz: QuizRecord): void {
    if (!this.isLoggedIn()) {
      alert('⚠️ Please login first to start the test.');
      return;
    }

    // If free test, navigate directly
    if (quiz.quizType === 'free') {
      this.router.navigate(['/instructions', quiz.quizId]);
    } else {
      alert('🔒 This is a premium test. Please subscribe to access.');
    }
  }

  /**
   * Fetch attempt info for each quiz
   */
  private loadQuizAttempts(): void {
    const observables: Observable<any>[] = this.quizRecords.map(quiz => {
      return this.getApiToken().pipe(
        switchMap(token => {
          const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
          const params = new HttpParams()
            .set('username', this.username)
            .set('quizId', quiz.quizId);

          return this.http.get<{ attempts: Attempt[], inProgress: boolean }>(this.attemptsUrl, { headers, params });
        }),
        map(response => {
          const attempts = response.attempts || [];
          const completedAttemptsCount = attempts.filter(a => a.status === 'completed').length;
          const inProgressAttempt = attempts.find(a => a.status === 'inprogress');

          quiz.isProgress = !!inProgressAttempt;
          quiz.attemptNo = completedAttemptsCount + 1;

          console.log(`✅ ${quiz.quizName}: Completed ${completedAttemptsCount}, InProgress ${quiz.isProgress}, AttemptNo ${quiz.attemptNo}`);
        })
      );
    });

    forkJoin(observables).subscribe({
      next: () => console.log('✅ All quizzes updated'),
      error: err => console.error('❌ Error fetching attempts:', err)
    });
  }

  /**
   * Retrieves ID Token for Authorization
   */
  private getApiToken(): Observable<string> {
    return this.oidcSecurityService.getIdToken().pipe(
      map((idToken: string) => {
        if (!idToken) throw new Error('No ID Token available. Please login again.');
        return idToken;
      })
    );
  }
}
