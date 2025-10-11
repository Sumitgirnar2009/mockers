import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionModel } from '../../../models/question.model';

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

  // Determine CSS class based on question status
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

  // Get the status of a question by its questionId
  getStatus(questionId: number): string {
    const question = this.snapshotMap?.get(questionId);

    if (!question) return this.getBoxClass('not-visited');
    if (question.IsSaved && question.IsVisited && question.IsAnswered) return this.getBoxClass('answered');
    if (question.IsMarkedForReview && !question.IsAnswered && question.IsVisited) return this.getBoxClass('marked');
    if (question.IsMarkedForReview && question.IsAnswered) return this.getBoxClass('answered-marked');
    if (question.IsVisited && !question.IsAnswered && !question.IsMarkedForReview && !question.IsSaved) return this.getBoxClass('not-answered');

    return this.getBoxClass('not-visited');
  }

  // Navigate to a question
  navigateTo(questionId: number): void {
    this.navigateQuestion.emit(questionId);
    console.log('Navigating to questionId:', questionId);
  }
}
