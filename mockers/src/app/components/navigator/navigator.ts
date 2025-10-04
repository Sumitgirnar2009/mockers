import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() navigateQuestion = new EventEmitter<number>();
  @Input() currentSection!: String;
  // currentSection!: String;


  snapshots = computed(() => this.fetchQuestionService.getAllSnapshotFromCache());
  numbers: number[];
  constructor(private fetchQuestionService: Fetchquestion) {
    this.numbers = Array.from({ length: 150 }, (_, k) => k + 1);
    const savedQuestionNumber = localStorage.getItem('currentQuestionNumber');
    if (savedQuestionNumber && Number(savedQuestionNumber) <= 50) {
      this.currentSection = 'Physics';
    } else if (savedQuestionNumber && Number(savedQuestionNumber) > 50 && Number(savedQuestionNumber) <= 100) {
      this.currentSection = 'Chemistry';
    }
    else if (savedQuestionNumber && Number(savedQuestionNumber) > 100) {
      this.currentSection = 'Maths';
    }
    else {
      this.currentSection = 'Physics';
    }
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
    } else if (this.currentSection === 'Maths') {
      return this.numbers.slice(100, 150); // 101–150
    }
    return [];
  }


  getStatus(index: number): string {
    const question = this.snapshots().get(index);
    // console.log("Inside snapshot ",index,question)

    if (question?.IsSaved && question?.IsVisited && question?.IsAnswered) {
      return this.getBoxClass('answered')
    } else if (question?.IsMarkedForReview && !question?.IsAnswered && question?.IsVisited) {
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
