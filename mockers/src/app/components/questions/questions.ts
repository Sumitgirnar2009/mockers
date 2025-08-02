import { Component, Input } from '@angular/core';
import { QuestionModel } from '../../models/question.model';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-questions',
  imports: [NgIf,NgFor],
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class Questions {
    @Input() currentQuestion!: QuestionModel;
    

  // @Output() optionSelected = new EventEmitter<number>();

  // onOptionSelect(index: number): void {
  //   // this.optionSelected.emit(index);
  //   this.optionSelected.emit(1); // Temporarily emit 1 for testing
  // }
}

