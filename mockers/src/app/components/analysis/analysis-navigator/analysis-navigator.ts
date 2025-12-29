import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionData, QuestionModel } from '../../../models/question.model';

@Component({
  selector: 'app-analysis-navigator',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './analysis-navigator.html',
  styleUrl: './analysis-navigator.css'
})
export class AnalysisNavigator {

  @Input() snapshotMap!: Map<number, QuestionModel>;
  @Input() currentSection: string | undefined;
  @Output() navigateQuestion = new EventEmitter<number>();
  @Input() questionMap!: Map<number, QuestionData>;  
  

  // Numbers for all questions
  numbers: number[] = Array.from({ length: 150 }, (_, k) => k + 1);

  // Get the question numbers for the current section
  getSectionNumbers(): number[] {
    switch (this.currentSection) {
      case 'Physics': return this.numbers.slice(0, 50);
      case 'Chemistry': return this.numbers.slice(50, 100);
      case 'Maths': return this.numbers.slice(100, 150);
      default: return [];
    }
  }



  // Get the status of a question by its questionId
getStatus(questionId: number): string {
    const question = this.snapshotMap?.get(questionId);
    const correctAnswer = this.questionMap?.get(questionId)?.correctAnswer;
    
    let classes: string[] = [];
    
    // Determine base status class
    if (!question) {
      classes.push('box-1'); // not-visited
    } else {
      // Base status
      if (question.IsSaved && question.IsVisited && question.IsAnswered) {
        classes.push('box-3'); // answered
      } else if (question.IsMarkedForReview && !question.IsAnswered && question.IsVisited) {
        classes.push('box-4'); // marked
      } else if (question.IsMarkedForReview && question.IsAnswered) {
        classes.push('box-5'); // answered-marked
      } else if (question.IsVisited && !question.IsAnswered && !question.IsMarkedForReview && !question.IsSaved) {
        classes.push('box-2'); // not-answered
      } else {
        classes.push('box-1'); // not-visited
      }
      
      // Add correctness indicator on top of base status
      if (question.IsAnswered && question.selectedOption !== undefined && correctAnswer !== undefined) {
        if (question.selectedOption === correctAnswer) {
          classes.push('correct-answer');
        } else {
          classes.push('incorrect-answer');
        }
      } else if (question.IsVisited && !question.IsAnswered) {
        classes.push('unanswered');
      }
    }
    
    return classes.join(' ');
  }


  // Navigate to a question
  navigateTo(questionId: number): void {
    this.navigateQuestion.emit(questionId);
    console.log('Navigating to questionId:', questionId);
  }
}
