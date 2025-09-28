import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitTestService {

  constructor(private http: HttpClient) { }
  
  submitTest(attemptId: string): Observable<any> {
  return this.http.post<any>(`/api/test/submit/${attemptId}`, {});
}

}
