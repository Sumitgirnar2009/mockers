import { Component } from '@angular/core';
import { QuestionModel } from '../../models/question.model';
import { Fetchquestion } from '../../service/fetchquestion';
import { KeyValuePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-legend',
  imports: [NgFor,KeyValuePipe],
  templateUrl: './legend.html',
  styleUrl: './legend.css'
})
export class Legend {
  snapshot: ReadonlyMap<number, QuestionModel>;

  constructor(private fetchQuestionService: Fetchquestion) {
    this.snapshot = this.fetchQuestionService.getQuestionStateSnapshot();
  }
}
