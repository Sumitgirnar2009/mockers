import { Component } from '@angular/core';
import { Legend } from '../legend/legend';
import { Questions } from '../questions/questions';
import { Navigator } from '../navigator/navigator';
import { SectionTabs } from '../section-tabs/section-tabs';
import { Fetchquestion } from '../../service/fetchquestion';
import { QuestionModel } from '../../models/question.model';
import { TimerComponent } from '../timer/timer';

@Component({
  selector: 'app-quiz',
  imports: [Legend, Questions, Navigator, TimerComponent, SectionTabs],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {


  handleCurrentSection($event: string) {
  throw new Error('Method not implemented.');
  }

  constructor(private quizService: Fetchquestion) { }

  currentQuestionNumber!: number

  currentQuestion!: QuestionModel;

  ngOnInit() {;
    this.currentQuestionNumber = 1 // Load first question
    this.currentQuestion = this.quizService.fetchQuestion(this.currentQuestionNumber);
    console.log("Current Question in ngOnInit:", this.currentQuestion);
  }

  handleNextQuestion(updatedQuestion: QuestionModel) {
    console.log("Inside handleNextQuestion:");
    this.quizService.saveQuestionStateSnapshot(updatedQuestion, updatedQuestion.id);
    if (this.currentQuestionNumber < 100) {
    this.currentQuestionNumber += 1;
    this.currentQuestion = this.quizService.fetchQuestion(this.currentQuestionNumber);
    }
    console.log("Current Question after next:", this.currentQuestion);
  }

  onSelectQuestion(index: number) {
    this.currentQuestionNumber = index;
    this.currentQuestion = this.quizService.fetchQuestion(this.currentQuestionNumber);
  }

  handlePreviousQuestion(questionId: number) {
    if (questionId > 1) {
      this.currentQuestionNumber -= 1;
      this.currentQuestion = this.quizService.fetchQuestion(this.currentQuestionNumber);
    }
  }

  handleNavigateQuestion(questionId: number) {
    this.currentQuestionNumber = questionId;
    this.currentQuestion = this.quizService.fetchQuestion(this.currentQuestionNumber);
  }


}



