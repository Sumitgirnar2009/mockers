import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionModel } from '../../models/question.model';
import { Fetchquestion } from '../../service/fetchquestion';


@Component({
  selector: 'app-navigator',
  imports: [CommonModule],
  templateUrl: './navigator.html',
  styleUrl: './navigator.css'
})
export class Navigator {
 numbers: number[];
 @Output() navigateQuestion = new EventEmitter<number>();

 snapshot: ReadonlyMap<number, QuestionModel>;
 
  constructor(private fetchQuestionService: Fetchquestion) {
    // Create an array from 0 to 99 (100 elements)
    this.numbers = Array.from({ length: 100 }, (_, k) => k); 
    this.snapshot = this.fetchQuestionService.getQuestionStateSnapshot();

  }

  getBoxClass(status: string): string {
    switch (status) {
      case 'not-visited': return 'box-1';
      case 'not-answered': return 'box-2';
      case 'answered': return 'box-3';
      case 'marked': return 'box-4';
      case 'answered-marked': return 'box-5';
      default: return 'box-1';
    }
  }

  getStatus(index: number): string {
    const question = this.snapshot.get(index);

    if (question?.IsSaved && question?.IsVisited && question?.IsAnswered) {
  return this.getBoxClass('answered')
    }else if (question?.IsMarkedForReview && !question?.IsAnswered && question?.IsVisited) {
      return this.getBoxClass('marked');
    } else if (question?.IsMarkedForReview && question?.IsAnswered) {
      return this.getBoxClass('answered-marked');
    }
    else if (question?.IsVisited && !question?.IsAnswered && !question?.IsMarkedForReview && !question?.IsSaved) {
      return this.getBoxClass('not-answered');
    } else {
      return this.getBoxClass('not-visited');
    }

  }


  navigateTo(index: number): void {
    // Implement your navigation logic here
    this.navigateQuestion.emit(index);
    console.log('Navigating to index:', index);
  }
}
