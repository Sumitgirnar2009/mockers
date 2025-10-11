import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fetchquestion } from '../../../service/fetchquestion';
import { Attempt } from '../../../service/handle-attempt-id';

@Component({
  selector: 'app-analysis-section-tabs',
  imports: [],
  templateUrl: './analysis-section-tabs.html',
  styleUrl: './analysis-section-tabs.css'
})
export class AnalysisSectionTabs {
  @Output() currentSection = new EventEmitter<string>();
  // @Output() currentQuestion = new EventEmitter<number>();
  // @Output() currPhyQues = new EventEmitter<string>();
  // @Output() currChemQues = new EventEmitter<string>();
  // @Output() currMathsQues = new EventEmitter<string>();
  // @Input() attemptId!: string;
  // @Input() attemptModel!: Attempt | null
  // @Input() quizId!: string
  @Input() currentQuestionNo!: number;  // received from parent


  selectedSection: string | undefined = 'Physics';


  ngOnInit() {
    this.currentSection.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);

    



  }

  onSectionChange(section: string) {
    this.selectedSection = section;
    this.currentSection.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);
  }
}



