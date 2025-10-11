import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, switchMap, forkJoin } from 'rxjs';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
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
  imports: [JsonPipe, AnalysisLegends, AnalysisQuestions, AnalysisSectionTabs, AnalysisNavigator, SectionTabs, NgIf, NgFor],
  templateUrl: './detail-analysis.html',
  styleUrl: './detail-analysis.css'
})
export class DetailAnalysis implements OnInit {


  attemptId!: string;
  quizId!: string;
  username!: string;

  currentQuestionModel!: QuestionModel;
  currentQuestionData!: QuestionData | null;

  public questionStateSnapshot = signal<Map<number, QuestionModel>>(new Map());
  private getQuestionApiUrl = 'https://8dwq1i3uy3.execute-api.ap-south-1.amazonaws.com/dev/getQuestion';
  public questionMap: Map<number, QuestionData> = new Map();

  snapshotMap: Map<number, QuestionModel> = new Map();

  private readonly apiUrl = 'https://cgh0dr9ps4.execute-api.ap-south-1.amazonaws.com/dev';
  currentSection: string | undefined;
  currentQuestionNo: number = 1;
  currentQuestion: QuestionData | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId') || '';
    this.quizId = this.route.snapshot.paramMap.get('quizId') || '';
    this.username = this.route.snapshot.paramMap.get('username') || '';

    console.log('Attempt ID:', this.attemptId);
    console.log('Quiz ID:', this.quizId);
    console.log('Username:', this.username);
  }

  ngOnInit(): void {
    if (!this.username || !this.attemptId) return;

    // Fetch both snapshot and questions and then load the first question
    forkJoin({
      snapshot: this.loadSnapshot(),
      questions: this.loadAllQuestionsToCache(this.quizId)
    }).subscribe({
      next: () => {
        this.currentQuestionNo = 1;
        this.currentQuestion = this.questionMap.get(this.currentQuestionNo) || null;
        this.currentQuestionModel = this.snapshotMap.get(this.currentQuestionNo)!;
        console.log("First question loaded:", this.currentQuestion);
        console.log("First snapshot loaded:", this.currentQuestionModel);
      },
      error: err => console.error('Error loading data:', err)
    });
  }

  private getApiToken() {
    return this.oidcSecurityService.getIdToken().pipe(
      map((idToken: string) => {
        if (!idToken) throw new Error('No ID Token available. Please login again.');
        return idToken;
      })
    );
  }

  private loadSnapshot(): Observable<void> {
    return this.getApiToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams()
          .set('username', this.username)
          .set('attemptId', this.attemptId);
        return this.http.get<any>(this.apiUrl, { headers, params });
      }),
      map(response => {
        const map = new Map<number, QuestionModel>();
        response.data.forEach((q: QuestionModel) => map.set(q.questionId, q));
        this.snapshotMap = map;
        console.log('Snapshot loaded and map :', this.snapshotMap);
      })
    );
  }

  loadAllQuestionsToCache(quizId: string): Observable<void> {
    return this.getApiToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<QuestionData[]>(
          `${this.getQuestionApiUrl}?quizId=${quizId}&questionId=ALL`,
          { headers }
        );
      }),
      map((questions: QuestionData[]) => {
        const map = new Map<number, QuestionData>();
        questions.forEach(q => map.set(Number(q.id), q));
        this.questionMap = map;
        console.log('All Questions cached:', this.questionMap.size, this.questionMap);
      })
    );
  }

  get snapshotObject() {
    return this.snapshotMap ? Object.fromEntries(this.snapshotMap) : {};
  }

  handleCurrentSection(section: string) {
    this.currentSection = section;

    if(this.currentSection === 'Physics') {
      this.currentQuestionNo = 1;
        this.currentQuestion = this.questionMap.get(this.currentQuestionNo) || null;
    this.currentQuestionModel = this.snapshotMap.get(this.currentQuestionNo)!;
    } else if(this.currentSection === 'Chemistry') {  
      this.currentQuestionNo = 51;
        this.currentQuestion = this.questionMap.get(this.currentQuestionNo) || null;
    this.currentQuestionModel = this.snapshotMap.get(this.currentQuestionNo)!;
    } else if(this.currentSection === 'Maths') { 
      this.currentQuestionNo = 101;
        this.currentQuestion = this.questionMap.get(this.currentQuestionNo) || null;
    this.currentQuestionModel = this.snapshotMap.get(this.currentQuestionNo)!;
    }
  }

  handleNavigateQuestion(questionId: number) {
    this.currentQuestionNo = questionId;
    this.currentQuestion = this.questionMap.get(this.currentQuestionNo) || null;
    this.currentQuestionModel = this.snapshotMap.get(this.currentQuestionNo)!;
    console.log("Current Question navigated:", this.currentQuestion);
    console.log("Current Question Model navigated:", this.currentQuestionModel);
  }

  handlePreviousQuestion(index: number) {
    this.currentQuestionNo = index - 1;
    this.currentQuestion = this.questionMap.get(this.currentQuestionNo) || null;
    this.currentQuestionModel = this.snapshotMap.get(this.currentQuestionNo)!;


  }
  handleNextQuestion(index: number) {
    this.currentQuestionNo = index + 1;
    this.currentQuestion = this.questionMap.get(this.currentQuestionNo) || null;
    this.currentQuestionModel = this.snapshotMap.get(this.currentQuestionNo)!;

  }
}
