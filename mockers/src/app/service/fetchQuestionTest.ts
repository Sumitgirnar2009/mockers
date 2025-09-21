import { Component, OnInit } from '@angular/core';
import { QuestionModel, QuestionData } from '../models/question.model';
import { Fetchquestion } from './fetchquestion';

@Component({
  selector: 'app-fetch-question-test',
  template: `<p>Check console for outputs</p>`
})
export class FetchQuestionTestComponent implements OnInit {

  constructor(private fetchQuestionService: Fetchquestion) { }

  ngOnInit() {
    this.testGetApiToken();
    // this.testFetchQuestion(1);
    // this.testSaveSnapshot(1);
  }

  testGetApiToken() {
    console.log("Here");
    this.fetchQuestionService.getApiToken().subscribe({
      next: token => console.log('API Token:', token),
      error: err => console.error('Token Error:', err)
    });
  }

  testFetchQuestion(questionNumber: number) {
    this.fetchQuestionService.fetchQuestion(questionNumber).subscribe({
      next: res => {
        console.log('Fetched Question:', res.questionData);
        console.log('Question Snapshot:', res.questionModel);
      },
      error: err => console.error('Fetch Question Error:', err)
    });
  }

  testSaveSnapshot(questionNumber: number) {
    // Create a sample QuestionModel
    const questionModel: QuestionModel = {
      attemptId: 'f4fdac68-e519-4a7a-9c08-28f802b4b5fb',
      id: questionNumber,
      selectedOption: 2,
      IsVisited: true,
      IsMarkedForReview: false,
      IsAnswered: true,
      IsSaved: true
    };

    this.fetchQuestionService.saveQuestionStateSnapshotToDB(questionModel, questionNumber).subscribe({
      next: res => console.log('Snapshot Save Response:', res),
      error: err => console.error('Snapshot Save Error:', err)
    });
  }
}
