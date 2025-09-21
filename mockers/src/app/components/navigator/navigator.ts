import { Component, EventEmitter, Input, Output } from '@angular/core';
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
 @Input() currentSection!: String;

snapshot: ReadonlyMap<number, QuestionModel> = new Map();
//  snapshot: ReadonlyMap<number, QuestionModel>;
 
//   constructor(private fetchQuestionService: Fetchquestion) {
//     // Create an array from 0 to 99 (100 elements)
//     this.numbers = Array.from({ length: 100 }, (_, k) => k + 1);
//     this.snapshot = this.fetchQuestionService.getQuestionStateSnapshot();
//   }


constructor(private fetchQuestionService: Fetchquestion) {
  // Create an array from 1 to 100 (question numbers)
  this.numbers = Array.from({ length: 100 }, (_, k) => k + 1);

  // Initialize snapshot map
  const tempMap = new Map<number, QuestionModel>();

  // Fetch snapshot for each question (example using attemptId)
  const attemptId = 'f4fdac68-e519-4a7a-9c08-28f802b4b5fb';
  this.numbers.forEach((questionNumber) => {
    this.fetchQuestionService.getSnapshotFromApi(attemptId, questionNumber).subscribe({
      next: (res) => {
        if (res.status === 200 && res.body) {
          tempMap.set(questionNumber, res.body);
        } 

        // Update readonly snapshot reference
        this.snapshot = tempMap;
      },
      error: (err) => console.error(`Error fetching snapshot for question ${questionNumber}:`, err)
    });
  });
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

  getSectionNumbers() {
  if (this.currentSection === 'Physics') {
    return this.numbers.slice(0, 50); // 1–50
  } else if (this.currentSection === 'Chemistry') {
    return this.numbers.slice(50, 100); // 51–100
  }
  return [];
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
