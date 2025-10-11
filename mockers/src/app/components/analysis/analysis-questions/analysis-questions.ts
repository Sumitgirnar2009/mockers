import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { QuestionData, QuestionModel } from '../../../models/question.model';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-analysis-questions',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './analysis-questions.html',
  styleUrls: ['./analysis-questions.css']
})
export class AnalysisQuestions {

  @Input() snapshotMap!: Map<number, QuestionModel>; // received from parent
  @Input() questionMap!: Map<number, QuestionData>;  // received from parent
  @Input() currentQuestionIndex!: number;  // received from parent
  @Input() currentQuestion!: QuestionData | null;
  @Input() currentQuestionModel!: QuestionModel;

  @Output() saveStatusAndNext = new EventEmitter<number>();
  @Output() saveStatusAndPrev = new EventEmitter<number>();
  

  get questionsArray(): QuestionData[] {
    return Array.from(this.questionMap?.values() || []);
  }


  Next(): void {
    if (this.currentQuestionIndex < 150) {
      this.saveStatusAndNext.emit(this.currentQuestionIndex);

    }
  }

  previous(): void {
    if (this.currentQuestionIndex > 1) {
      this.saveStatusAndNext.emit(this.currentQuestionIndex);
    }
  }

  getOptionClass(optionNumber: number): string {
  if (!this.currentQuestionModel) {
    // Question not visited
    return 'bg-light';
  }

  if (this.currentQuestionModel.selectedOption === -1) {
    // Question visited but not answered
    return 'bg-light';
  }

  // Dummy correct answer logic: assume option 1 is correct
  if (this.currentQuestionModel.selectedOption === optionNumber) {
    return optionNumber === 1 ? 'bg-success text-white' : 'bg-danger text-white';
  }

  return 'bg-light';
}



}



// Input() currentQuestionModel!: QuestionModel;
//   @Input() currentQuestionData!: QuestionData | null;
//   @Input() attemptId!: string;
//   @Output() saveStatusAndNext = new EventEmitter<QuestionModel>();
//   @Output() saveStatusAndPrev = new EventEmitter<number>();

//   markForReviewAndNext() {
//     if (this.currentQuestionModel) {

//       this.currentQuestionModel.IsMarkedForReview = true;
//       this.currentQuestionModel.IsSaved = false
//       this.currentQuestionModel.attemptId = this.attemptId      
//       if(this.currentQuestionModel.selectedOption != -1) {
//         this.currentQuestionModel.IsAnswered = true
//       }
//       this.saveStatusAndNext.emit(this.currentQuestionModel);

//       console.log("Question marked for review!");
//     }
//   }

//   saveAndNext() {
//     console.log("Inside saveAndNext method",this.currentQuestionModel);
//     if (this.currentQuestionModel) {

//       this.currentQuestionModel.IsVisited = true;
//       this.currentQuestionModel.IsSaved = true;
//       this.currentQuestionModel.IsMarkedForReview = false;
//       this.currentQuestionModel.attemptId = this.attemptId      

      
//       if (this.currentQuestionModel.selectedOption !== -1) {
//         this.currentQuestionModel.IsAnswered = true;
//       }
//       else {
//         this.currentQuestionModel.IsAnswered = false;
//         this.currentQuestionModel.IsSaved = false;
//         this.currentQuestionModel.IsMarkedForReview = false;
//       }
//       console.log("Current question state in saveAndNext:", this.currentQuestionModel);
//       // Emit the updated question to the parent
//       this.saveStatusAndNext.emit(this.currentQuestionModel);
//       console.log("Answer saved! Moving to next question...");
//     }
//   }

//   previous() {
//     console.log("Inside previous method",this.currentQuestionModel);
//     if (this.currentQuestionModel) {
//       this.saveStatusAndPrev.emit(this.currentQuestionModel.questionId);
//       console.log("Moving to previous question...");
//     }
//   }
// }


