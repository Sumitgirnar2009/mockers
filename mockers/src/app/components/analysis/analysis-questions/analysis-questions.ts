import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { QuestionData, QuestionModel } from '../../../models/question.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LatexPipe } from '../../../pipes/latex-pipe';

@Component({
  selector: 'app-analysis-questions',
  standalone: true,
  imports: [NgFor, NgIf, NgClass,LatexPipe],
  templateUrl: './analysis-questions.html',
  styleUrls: ['./analysis-questions.css']
})
export class AnalysisQuestions {

    private sanitizer = inject(DomSanitizer);

  @Input() snapshotMap!: Map<number, QuestionModel>; // received from parent
  @Input() questionMap!: Map<number, QuestionData>;  // received from parent
  @Input() currentQuestionIndex!: number;  // received from parent
  @Input() currentQuestion!: QuestionData | null;
  @Input() currentQuestionModel!: QuestionModel;

  @Output() saveStatusAndNext = new EventEmitter<number>();
  @Output() saveStatusAndPrev = new EventEmitter<number>();
  
   ngOnInit() {
    this.loadKatexStyles();
  }

    private loadKatexStyles() {
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }
  }

  
  /**
   * Safely gets text content, handling null/undefined values
   */
  getSafeText(text: string | null | undefined): string {
    return text ?? '';
  }

  /**
   * Sanitizes HTML content for safe rendering
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


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
      this.saveStatusAndPrev.emit(this.currentQuestionIndex);
    }
  }

getOptionClass(optionNumber: number) {
  const selected = this.currentQuestionModel?.selectedOption;
  const correct = this.currentQuestion?.correctAnswer;

  // Not attempted → only show correct
  if (selected === -1) {
    return optionNumber === correct ? 'correct-option' : '';
  }

  // Correct answer selected
  if (optionNumber === selected && selected === correct) {
    return 'correct-selected';
  }

  // Wrong answer selected
  if (optionNumber === selected && selected !== correct) {
    return 'wrong-selected';
  }

  // Highlight correct answer
  if (optionNumber === correct) {
    return 'correct-option';
  }

  return '';
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


