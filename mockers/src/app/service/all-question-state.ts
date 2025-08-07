// src/app/services/question-state.service.ts
import { Injectable } from '@angular/core';
import { QuestionModel } from '../models/question.model';
import { QuestionStatus } from './fetchquestion';

@Injectable({
  providedIn: 'root'
})
export class QuestionStateService {
  private questions: QuestionModel[] = [];
  private currentIndex = 0;

  // Initialize with questions
  initialize(questions: QuestionModel[]) {
    this.questions = questions.map(q => ({
      ...q,
      state: QuestionStatus.NotVisited,
      selectedOption: -1
    }));
  }

  // Get all questions
  getAllQuestions(): QuestionModel[] {
    return this.questions;
  }

  // Get current question
  getCurrentQuestion(): QuestionModel | null {
    return this.questions[this.currentIndex] || null;
  }

  // Update question state
  updateQuestion(index: number, updates: Partial<QuestionModel>) {
    if (index >= 0 && index < this.questions.length) {
      this.questions[index] = { ...this.questions[index], ...updates };
    }
  }

  // Move to next question
  nextQuestion(): QuestionModel | null {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return this.getCurrentQuestion();
    }
    return null;
  }

  // Move to previous question
  previousQuestion(): QuestionModel | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.getCurrentQuestion();
    }
    return null;
  }

  // Jump to specific question
  goToQuestion(index: number): QuestionModel | null {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      return this.getCurrentQuestion();
    }
    return null;
  }

  // Get current question index
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  // Get total questions count
  getTotalQuestions(): number {
    return this.questions.length;
  }
}