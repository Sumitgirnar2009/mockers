import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionData, QuestionModel } from '../../../models/question.model';

@Component({
  selector: 'app-analysis-questions',
  imports: [],
  templateUrl: './analysis-questions.html',
  styleUrl: './analysis-questions.css'
})
export class AnalysisQuestions {

  @Input() currentQuestionModel!: QuestionModel;
  @Input() currentQuestionData!: QuestionData | null;
  @Input() attemptId!: string;
  @Output() saveStatusAndNext = new EventEmitter<QuestionModel>();
  @Output() saveStatusAndPrev = new EventEmitter<number>();

  markForReviewAndNext() {
    if (this.currentQuestionModel) {

      this.currentQuestionModel.IsMarkedForReview = true;
      this.currentQuestionModel.IsSaved = false
      this.currentQuestionModel.attemptId = this.attemptId      
      if(this.currentQuestionModel.selectedOption != -1) {
        this.currentQuestionModel.IsAnswered = true
      }
      this.saveStatusAndNext.emit(this.currentQuestionModel);

      console.log("Question marked for review!");
    }
  }

  saveAndNext() {
    console.log("Inside saveAndNext method",this.currentQuestionModel);
    if (this.currentQuestionModel) {

      this.currentQuestionModel.IsVisited = true;
      this.currentQuestionModel.IsSaved = true;
      this.currentQuestionModel.IsMarkedForReview = false;
      this.currentQuestionModel.attemptId = this.attemptId      

      
      if (this.currentQuestionModel.selectedOption !== -1) {
        this.currentQuestionModel.IsAnswered = true;
      }
      else {
        this.currentQuestionModel.IsAnswered = false;
        this.currentQuestionModel.IsSaved = false;
        this.currentQuestionModel.IsMarkedForReview = false;
      }
      console.log("Current question state in saveAndNext:", this.currentQuestionModel);
      // Emit the updated question to the parent
      this.saveStatusAndNext.emit(this.currentQuestionModel);
      console.log("Answer saved! Moving to next question...");
    }
  }

  previous() {
    console.log("Inside previous method",this.currentQuestionModel);
    if (this.currentQuestionModel) {
      this.saveStatusAndPrev.emit(this.currentQuestionModel.questionId);
      console.log("Moving to previous question...");
    }
  }
}



