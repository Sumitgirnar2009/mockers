import { Component, Input, SimpleChanges } from '@angular/core';
import { QuestionModel } from '../../models/question.model';
import { Fetchquestion } from '../../service/fetchquestion';
import { CommonModule, KeyValuePipe, NgFor } from '@angular/common';
import { AllSectionsLegend } from '../../models/section-legend.model';

@Component({
  selector: 'app-legend',
  imports: [NgFor,KeyValuePipe,CommonModule],
  templateUrl: './legend.html',
  styleUrl: './legend.css'
})
export class Legend {
  @Input() currentSection!: String; // Add this input property


}


