import { Injectable, signal } from '@angular/core';
import { QuestionModel } from '../models/question.model'; // Adjust the import path as necessary
import sampleQuestions from '../../assets/static-data/sample-questions.json';
import { catchError, map, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { QuestionObj } from '../models/question.model';
import { OptionObj } from '../models/question.model';
import { QuestionData } from '../models/question.model';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';


export enum QuestionStatus {
  NotVisited = 'NotVisited',
  NotAnswered = 'NotAnswered',
  Answered = 'Answered',
  MarkedForReview = 'MarkedForReview',
  AnsweredAndMarkedForReview = 'AnsweredAndMarkedForReview',
}

// export interface LegendCounts {
//   answered: number;
//   notAnswered: number;
//   notVisited: number;
//   markedForReview: number;
//   answeredAndMarked: number;
//   total: number;
// }


// attemptid - Quizid -- username -- questionId -- selectedOption -- isVisited -- IsMarkedForReview -- IsAnswered -- IsSaved partition key : username,attemptId


@Injectable({
  providedIn: 'root',
})

export class Fetchquestion {
  private getQuestionApiUrl = 'https://8dwq1i3uy3.execute-api.ap-south-1.amazonaws.com/dev/getQuestion';
  private getSnapshotApiUrl = 'https://j5bt4mi9j5.execute-api.ap-south-1.amazonaws.com/dev';

  res: { status: number; body: QuestionData | null } | null = null;

  public questionMapSignal = signal<Map<number, QuestionData>>(new Map());




  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) { }

  // questionStateSnapshot: Map<number, QuestionModel> = new Map();
  public questionStateSnapshot = signal<Map<number, QuestionModel>>(new Map());




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


  fetchQuestion(
    questionNumber: number,
    attemptId : string
  ): Observable<{ questionData: QuestionData | null; questionModel: QuestionModel }> {
    console.log("Fetching locally for question number:", questionNumber);

    const questionData = this.questionMapSignal().get(questionNumber) || null;
    console.log("Question Data from local cache:", questionData);

    // Get snapshot from map, or create a new one if missing
    const questionModelFromMap = this.questionStateSnapshot().get(questionNumber);
    const questionModel: QuestionModel = questionModelFromMap ?? {
      attemptId: attemptId,
      questionId: questionNumber,
      selectedOption: -1,
      IsVisited: true,
      IsMarkedForReview: false,
      IsAnswered: false,
      IsSaved: false,
    };

    // If it was missing, save to backend
    if (!questionModelFromMap) {
      console.log("Creating new snapshot locally", questionModel);
      return this.saveQuestionStateSnapshotToDB(questionModel, questionNumber).pipe(
        map(() => ({ questionData, questionModel }))
      );
    }

    // Otherwise, return existing snapshot
    console.log("Before return", questionData, questionModel);
    return of({ questionData, questionModel });
  }


  // getQuestionFromApi(
  //   quizId: string,
  //   questionId: number
  // ): Observable<{ status: number; body: QuestionData | null }> {
  //   return this.getApiToken().pipe(
  //     switchMap((token: string) => {
  //       const headers = new HttpHeaders({
  //         Authorization: `Bearer ${token}`
  //       });

  //       return this.http.get<QuestionData>(
  //         `${this.getQuestionApiUrl}?quizId=${quizId}&questionId=${questionId}`,
  //         {
  //           headers,
  //           observe: 'response'
  //         }
  //       );
  //     }),
  //     map((response: HttpResponse<QuestionData>) => {
  //       return {
  //         status: response.status,
  //         body: response.body ?? null
  //       };
  //     })
  //   );
  // }


  /** Load all questions and initialize signal */
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

  /** Get a specific question (signal value) */
  getQuestionfromCache(questionId: number): QuestionData | undefined {
    return this.questionMapSignal().get(questionId); // use get() instead of []
  }


  // getSnapshotFromApi(
  //   attemptId: string,
  //   questionId: number
  // ): Observable<{ status: number; body: QuestionModel | null }> {
  //   return this.getApiToken().pipe(
  //     switchMap((token: string) => {
  //       const headers = new HttpHeaders({
  //         Authorization: `Bearer ${token}`
  //       });

  //       return this.http.get<QuestionModel>(
  //         `${this.getSnapshotApiUrl}?attemptid=${attemptId}&questionId=${questionId}`,
  //         {
  //           headers,
  //           observe: 'response' // ✅ get full HTTP response
  //         }
  //       );
  //     }),
  //     map((response: HttpResponse<QuestionModel>) => {
  //       return {
  //         status: response.status,
  //         body: response.body ?? null
  //       };
  //     })
  //   );
  // }


  saveQuestionStateSnapshotToDB(
    questionModel: QuestionModel,
    questionNumber: number
  ): Observable<{ status: number; body: any }> {
    return this.getApiToken().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        console.log("Snapshot POST API request");

        const payload = {
          attemptId: questionModel.attemptId,
          questionId: questionNumber,
          selectedOption: questionModel.selectedOption,
          IsVisited: questionModel.IsVisited,
          IsMarkedForReview: questionModel.IsMarkedForReview,
          IsAnswered: questionModel.IsAnswered,
          IsSaved: questionModel.IsSaved,
        };

        return this.http.post<any>(
          this.getSnapshotApiUrl,
          payload,
          { headers, observe: 'response' }
        );
      }),
      map((response: HttpResponse<any>) => {
        // ✅ Update only this question in local cache
        const updated = new Map(this.questionStateSnapshot());
        updated.set(questionNumber, questionModel);
        this.questionStateSnapshot.set(updated);

        return {
          status: response.status,
          body: response.body ?? null
        };
      })
    );
  }



  getAllSnapshotFromCache(): Map<number, QuestionModel> {
    console.log("Question State snapshot", this.questionStateSnapshot());
    return this.questionStateSnapshot();
  }


  /** Load all snapshots for an attemptId and populate signal Map */
  loadAllSnapshotsToCache(attemptId: string): Observable<void> {
    return this.getApiToken().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.get<QuestionModel[]>(
          `${this.getSnapshotApiUrl}?attemptid=${attemptId}&questionId=ALL`,
          { headers }
        );
      }),
      map((snapshots: QuestionModel[]) => {
        const snapshotMap = new Map<number, QuestionModel>();
        snapshots.forEach((s) => snapshotMap.set(s.questionId, s));
        this.questionStateSnapshot.set(snapshotMap); // populate signal
      })
    );
  }



}