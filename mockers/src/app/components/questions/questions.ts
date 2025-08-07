import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionModel } from '../../models/question.model';
import { NgFor, NgIf } from '@angular/common';
import { QuestionStatus } from '../../service/fetchquestion';
import { flatMap } from 'rxjs';


@Component({
  selector: 'app-questions',
  imports: [NgIf, NgFor],
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class Questions {

  @Input() currentQuestion!: QuestionModel;
  @Output() saveStatusAndNext = new EventEmitter<QuestionModel>();
  @Output() saveStatusAndPrev = new EventEmitter<number>();

  markForReviewAndNext() {
    if (this.currentQuestion) {
      this.currentQuestion.IsMarkedForReview = true;
      this.currentQuestion.IsSaved = false
      if(this.currentQuestion.selectedOption != -1) {
        this.currentQuestion.IsAnswered = true
      }
      this.saveStatusAndNext.emit(this.currentQuestion);

      console.log("Question marked for review!");
    }
  }

  saveAndNext() {
    console.log("Inside saveAndNext method");
    if (this.currentQuestion) {

      this.currentQuestion.IsVisited = true;
      this.currentQuestion.IsSaved = true;
      this.currentQuestion.IsMarkedForReview = false;
      
      if (this.currentQuestion.selectedOption !== -1) {
        this.currentQuestion.IsAnswered = true;
      } 
      else {
        this.currentQuestion.IsAnswered = false;
        this.currentQuestion.IsSaved = false;
        this.currentQuestion.IsMarkedForReview = false;
      }
      console.log("Current question state in saveAndNext:", this.currentQuestion);
      // Emit the updated question to the parent
      this.saveStatusAndNext.emit(this.currentQuestion);
      console.log("Answer saved! Moving to next question...");
    }
  }

  previous() {
    if (this.currentQuestion && this.currentQuestion.id > 1) {
      this.saveStatusAndPrev.emit(this.currentQuestion.id);
      console.log("Moving to previous question...");
    }
  }
}


