import { Injectable } from '@angular/core';
import { QuestionModel } from '../models/question.model'; // Adjust the import path as necessary
import sampleQuestions from '../../assets/static-data/sample-questions.json';
import { catchError, map, Observable, of, Subject, switchMap, throwError } from 'rxjs';
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



  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) { }

  questionStateSnapshot: Map<number, QuestionModel> = new Map();

  attemptId: string = 'f4fdac68-e519-4a7a-9c08-28f802b4b5fb';

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

  getQuestionStateSnapshot(): Map<number, QuestionModel> {
    return this.questionStateSnapshot;
  }

  saveQuestionStateSnapshot(questionModel: QuestionModel, questionId: number) {
    // Simulate saving question status in a database
    console.log("Saving question state snapshot for question ID:", questionId, "with state:", questionModel)
    this.questionStateSnapshot.set(questionId, questionModel);


    // saveSnapshot(questionId, questionModel);
  }

  // fetchQuestion(questionNumber: number): { questionData: QuestionData; questionModel: QuestionModel } {

  //   //fetch question first 
  //   this.getQuestionFromApi('37a81c5d-6362-41e4-aaf3-9d925579f538', 1).subscribe({
  //     next: (res) => {
  //       console.log('API Status:', res.status);
  //       console.log('Question Data:', res.body);
  //     },
  //     error: (err) => {
  //       console.error('API Error:', err);
  //     }
  //   });

  // //fetch question first by doing the api call

  // //fetch snapshot here if it exists then return that snapshot 
  // // if not present then create new snapshot with default values and return that snapshot
  // //at last save the snapshot by doing the other api call to save the snapshot

  //   // const currQuestionModel = this.getSnapshotFromApi(this.attemptId, questionNumber);


  //   this.getSnapshotFromApi('f4fdac68-e519-4a7a-9c08-28f802b4b5fb', 5).subscribe({
  //     next: (res) => {
  //       console.log('API Status:', res.status);
  //       console.log('Snapshot:', res.body);

  //       if (res.status == 200 && res.body) {

  //       }

  //     },
  //     error: (err) => {
  //       console.error('Error fetching snapshot:', err);
  //     }
  //   });



  //   const cachedQuestion = this.questionStateSnapshot.get(questionNumber);


  //   if (currQuestionModel !== undefined) {
  //     // console.log("Fetching from cache for question number:", questionNumber);

  //     // return {
  //     //   questionData: { "quizId": "37a81c5d-6362-41e4-aaf3-9d925579f538", "id": 3, "question": { "text": "A force of 10 N is applied to move an object 5 m. How much work is done?", "image": "NA" }, "options": [{ "text": "25 J", "image": "NA" }, { "text": "50 J", "image": "NA" }, { "text": "75 J", "image": "NA" }, { "text": "100 J", "image": "NA" }] },
  //     //   questionModel: cachedQuestion
  //     // };



  //   }


  //   else {

  //     console.log("Fetching from api for question number:", questionNumber);


  //     const questionModel: QuestionModel = {
  //       attemptId: "f4fdac68-e519-4a7a-9c08-28f802b4b5fb",
  //       id: questionNumber,
  //       selectedOption: -1,
  //       IsVisited: true,
  //       IsMarkedForReview: false,
  //       IsAnswered: false,
  //       IsSaved: false,
  //     };




  //     this.saveQuestionStateSnapshot(questionModel, questionNumber);
  //     return {
  //       questionData: res.body,
  //       questionModel: questionModel
  //     };



  //   }

  // }

  fetchQuestion(
    questionNumber: number
  ): Observable<{ questionData: QuestionData | null; questionModel: QuestionModel }> {
    console.log("Fetching from API for question number:", questionNumber);

    // 1. Fetch Question
    return this.getQuestionFromApi('37a81c5d-6362-41e4-aaf3-9d925579f538', questionNumber).pipe(
      switchMap((questionRes) => {
        console.log('Question API Status:', questionRes.status);
        console.log('Question Data:', questionRes.body);

        const questionData = questionRes.body;

        // 2. Fetch Snapshot
        console.log("Fetching snapshot for question number:", questionNumber);
        return this.getSnapshotFromApi('f4fdac68-e519-4a7a-9c08-28f802b4b5fb', questionNumber).pipe(
          map((snapshotRes) => {
            console.log('Snapshot API Status:', snapshotRes.status);
            console.log('Snapshot Data:', snapshotRes.body);

            return {
              questionData,
              questionModel: snapshotRes.body!
            };
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 404) {
              // ✅ Snapshot not found → create new one
              const questionModel: QuestionModel = {
                attemptId: "f4fdac68-e519-4a7a-9c08-28f802b4b5fb",
                id: questionNumber,
                selectedOption: -1,
                IsVisited: true,
                IsMarkedForReview: false,
                IsAnswered: false,
                IsSaved: false,
              };

              console.log("Snapshot 404 → creating new one", questionModel);

              // ✅ Save snapshot and then return it
              return this.saveQuestionStateSnapshotToDB(questionModel, questionNumber).pipe(
                map(() => ({
                  questionData,
                  questionModel
                })),
                catchError((saveErr) => {
                  console.error("Snapshot save failed", saveErr);
                  // fallback: still return model so UI doesn’t break
                  return of({ questionData, questionModel });
                })
              );
            }

            // ❌ For any other error → rethrow
            console.error("Snapshot fetch failed", err);
            return throwError(() => err);
          })
        );
      })
    );
  }



  getQuestionFromApi(
    quizId: string,
    questionId: number
  ): Observable<{ status: number; body: QuestionData | null }> {
    return this.getApiToken().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.get<QuestionData>(
          `${this.getQuestionApiUrl}?quizId=${quizId}&questionId=${questionId}`,
          {
            headers,
            observe: 'response'
          }
        );
      }),
      map((response: HttpResponse<QuestionData>) => {
        return {
          status: response.status,
          body: response.body ?? null
        };
      })
    );
  }

  getSnapshotFromApi(
    attemptId: string,
    questionId: number
  ): Observable<{ status: number; body: QuestionModel | null }> {
    return this.getApiToken().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.get<QuestionModel>(
          `${this.getSnapshotApiUrl}?attemptid=${attemptId}&questionId=${questionId}`,
          {
            headers,
            observe: 'response' // ✅ get full HTTP response
          }
        );
      }),
      map((response: HttpResponse<QuestionModel>) => {
        return {
          status: response.status,
          body: response.body ?? null
        };
      })
    );
  }

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
          this.getSnapshotApiUrl,  // ✅ payload in request body
          payload,
          { headers, observe: 'response' }
        );
      }),
      map((response: HttpResponse<any>) => ({
        status: response.status,
        body: response.body ?? null
      }))
    );
  }

}