import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { JsonPipe, NgIf } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AnalysisLegends } from '../analysis-legends/analysis-legends';
import { AnalysisQuestions } from '../analysis-questions/analysis-questions';
import { AnalysisSectionTabs } from '../analysis-section-tabs/analysis-section-tabs';
import { AnalysisNavigator } from "../analysis-navigator/analysis-navigator";
import { SectionTabs } from "../../section-tabs/section-tabs";
import { QuestionData, QuestionModel } from '../../../models/question.model';

@Component({
  selector: 'app-detail-analysis',
  standalone: true,
  imports: [JsonPipe, AnalysisLegends, AnalysisQuestions, AnalysisSectionTabs, AnalysisNavigator, SectionTabs,NgIf],
  templateUrl: './detail-analysis.html',
  styleUrl: './detail-analysis.css'
})
export class DetailAnalysis {

  attemptId!: string;
  quizId!: string;
  username!: string;
  
  
  
    // questionStateSnapshot: Map<number, QuestionModel> = new Map();
  public questionStateSnapshot = signal<Map<number, QuestionModel>>(new Map());
    private getQuestionApiUrl = 'https://8dwq1i3uy3.execute-api.ap-south-1.amazonaws.com/dev/getQuestion';
      public questionMapSignal = signal<Map<number, QuestionData>>(new Map());



  snapshotData = signal<any>(null); // signal to store fetched JSON

  private readonly apiUrl = 'https://cgh0dr9ps4.execute-api.ap-south-1.amazonaws.com/dev';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId') || '';
    this.quizId = this.route.snapshot.paramMap.get('quizId') || '';
    this.username = this.route.snapshot.paramMap.get('username') || '';

    console.log('Attempt ID:', this.attemptId);

    if (this.username && this.attemptId) {
      this.loadSnapshot();
    }
  }

  private getApiToken() {
    return this.oidcSecurityService.getIdToken().pipe(
      map((idToken: string) => {
        if (!idToken) throw new Error('No ID Token available. Please login again.');
        return idToken;
      })
    );
  }

  private loadSnapshot(): void {
    this.getApiToken()
      .pipe(
        switchMap(token => {
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
          const params = new HttpParams()
            .set('username', this.username)
            .set('attemptId', this.attemptId);

          return this.http.get<any>(this.apiUrl, { headers, params });
        })
      )
      .subscribe({
        next: data => {
          this.snapshotData.set(data);
          console.log('Fetched snapshot:', data);
        },
        error: err => console.error('Error fetching snapshot:', err)
      });
  }

    loadAllQuestionsToCache(quizId: string): Observable<void> {
      return this.getApiToken().pipe(
        switchMap((token) => {
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
          return this.http.get<QuestionData[]>(
            `${this.getQuestionApiUrl}?quizId=${quizId}&questionId=ALL`,
            { headers }
          );
        }),
        map((questions: QuestionData[]) => {
          const map = new Map<number, QuestionData>();
          questions.forEach(q => map.set(Number(q.id), q));
          this.questionMapSignal.set(map); // initialize signal
        })
      );
    }


}
