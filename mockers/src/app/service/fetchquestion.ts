import { Injectable } from '@angular/core';
import { QuestionModel } from '../models/question.model'; // Adjust the import path as necessary
import sampleQuestions from '../static-data/sample-questions.json';


@Injectable({
  providedIn: 'root',
})

export class Fetchquestion {


  getQuestion(questionNumber: number): QuestionModel {
    
    const question = sampleQuestions[questionNumber];

    const questionModel: QuestionModel = {
      id: question.id,
      text: question.text,
      options : question.options,
      visited: false,
      markedForReview: false
    }

    return questionModel;
  }
}
