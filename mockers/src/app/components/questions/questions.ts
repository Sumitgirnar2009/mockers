import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionModel } from '../../models/question.model';
import { QuestionData } from '../../models/question.model';
import { NgFor, NgIf } from '@angular/common';
import { QuestionStatus } from '../../service/fetchquestion';
import { flatMap } from 'rxjs';
import { ModPipe } from '../../mod-pipe';




@Component({
  selector: 'app-questions',
  imports: [NgIf, NgFor,ModPipe],
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class Questions {

  @Input() currentQuestionModel!: QuestionModel;
  @Input() currentQuestionData!: QuestionData | null;
  @Output() saveStatusAndNext = new EventEmitter<QuestionModel>();
  @Output() saveStatusAndPrev = new EventEmitter<number>();

  markForReviewAndNext() {
    if (this.currentQuestionModel) {

      this.currentQuestionModel.IsMarkedForReview = true;
      this.currentQuestionModel.IsSaved = false
      
      if(this.currentQuestionModel.selectedOption != -1) {
        this.currentQuestionModel.IsAnswered = true
      }
      this.saveStatusAndNext.emit(this.currentQuestionModel);

      console.log("Question marked for review!");
    }
  }

  saveAndNext() {
    console.log("Inside saveAndNext method");
    if (this.currentQuestionModel) {

      this.currentQuestionModel.IsVisited = true;
      this.currentQuestionModel.IsSaved = true;
      this.currentQuestionModel.IsMarkedForReview = false;
      
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
    if (this.currentQuestionModel && this.currentQuestionModel.id > 1) {
      this.saveStatusAndPrev.emit(this.currentQuestionModel.id);
      console.log("Moving to previous question...");
    }
  }
}


