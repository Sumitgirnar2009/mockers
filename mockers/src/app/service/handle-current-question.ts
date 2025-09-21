import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HandleCurrentQuestion {
  private readonly STORAGE_KEY = 'currentQuestionNumber';
  private currentQuestionNumber: number = 1;

  constructor() {
    // Initialize from localStorage if available, otherwise set to 1
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && !isNaN(Number(saved))) {
      this.currentQuestionNumber = Number(saved);
    } else {
      this.setCurrentQuestion(1);
    }
  }

  // Get the current question number
  getCurrentQuestion(): number {
    return this.currentQuestionNumber;
  }

  // Update question number and persist to localStorage
  setCurrentQuestion(num: number): void {
    this.currentQuestionNumber = num;
    localStorage.setItem(this.STORAGE_KEY, num.toString());
  }

  // Reset (if needed)
  reset(): void {
    this.setCurrentQuestion(1);
  }
}
