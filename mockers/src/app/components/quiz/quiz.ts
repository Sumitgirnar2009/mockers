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
  styleUrl: './quiz.css'
})
export class Quiz {

  constructor(private quizService: Fetchquestion) { }

  currentQuestionNumber!: number

  currentQuestion!: QuestionModel;

  ngOnInit() {
    this.currentQuestionNumber = 3 // Load first question
    this.currentQuestion = this.quizService.getQuestion(this.currentQuestionNumber);
  }
  
  onSelectQuestion(index: number) {
    this.currentQuestionNumber = index;
    this.currentQuestion = this.quizService.getQuestion(this.currentQuestionNumber);
  }

  

}

