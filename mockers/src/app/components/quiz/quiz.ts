import { Component } from '@angular/core';
import { Legend } from '../legend/legend';
import { Questions } from '../questions/questions';
import { Navigator } from '../navigator/navigator';
import { Timer } from '../timer/timer';
import { SectionTabs } from '../section-tabs/section-tabs';
import { Fetchquestion } from '../../service/fetchquestion';
import { QuestionModel } from '../../models/question.model';

@Component({
  selector: 'app-quiz',
  imports: [Legend, Questions, Navigator, Timer, SectionTabs],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {

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



