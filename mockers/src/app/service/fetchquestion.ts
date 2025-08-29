import { Injectable } from '@angular/core';
import { QuestionModel } from '../models/question.model'; // Adjust the import path as necessary
import sampleQuestions from '../../assets/static-data/sample-questions.json';
import { Subject } from 'rxjs';
import { QuestionObj } from '../models/question.model';
import { OptionObj } from '../models/question.model';


export enum QuestionStatus {
  NotVisited = 'NotVisited',
  NotAnswered = 'NotAnswered',
  Answered = 'Answered',
  MarkedForReview = 'MarkedForReview',
  AnsweredAndMarkedForReview = 'AnsweredAndMarkedForReview',
}


@Injectable({
  providedIn: 'root',
})

export class Fetchquestion {


  questionStateSnapshot: Map<number, QuestionModel> = new Map();

  getQuestionStateSnapshot(): Map<number, QuestionModel> {
    return this.questionStateSnapshot;
  }

  saveQuestionStateSnapshot(questionModel: QuestionModel, questionId: number) {
    // Simulate saving question status in a database
    console.log("Saving question state snapshot for question ID:", questionId, "with state:", questionModel)
    this.questionStateSnapshot.set(questionId, questionModel);
  }

  fetchQuestion(questionNumber: number): QuestionModel {
  const cachedQuestion = this.questionStateSnapshot.get(questionNumber);
  
  if (cachedQuestion !== undefined) {
    console.log("Fetching from cache for question number:", questionNumber);
    return cachedQuestion;
  } else {
    const question = sampleQuestions[questionNumber - 1];

    const questionModel: QuestionModel = {
      id: question.id,
      question : question.question,
      options: question.options,
      selectedOption: -1,
      IsVisited: true,
      IsMarkedForReview: false,
      IsAnswered: false,
      IsSaved: false, // Initialize as not saved
    };

    this.saveQuestionStateSnapshot(questionModel, questionNumber);
    return questionModel;
  }
}

  

}
