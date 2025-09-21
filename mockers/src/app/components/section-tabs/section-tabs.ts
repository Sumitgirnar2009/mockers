import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-section-tabs',
  imports: [],
  templateUrl: './section-tabs.html',
  styleUrl: './section-tabs.css'
})
export class SectionTabs {
  @Output() currentSection = new EventEmitter<string>();
  @Output() currPhyQues = new EventEmitter<string>();
  @Output() currChemQues = new EventEmitter<string>();
  @Output() currMathsQues = new EventEmitter<string>();
  
  selectedSection: string | undefined ;

  ngOnInit() {;

    const savedQuestionNumber = localStorage.getItem('currentQuestionNumber');
    if(savedQuestionNumber && Number(savedQuestionNumber) <= 50){
      this.selectedSection = 'Physics';
    } else if (savedQuestionNumber && Number(savedQuestionNumber) > 50 && Number(savedQuestionNumber) <= 100  ){
      this.selectedSection = 'Chemistry';   
    }
     else if (savedQuestionNumber && Number(savedQuestionNumber) > 100){
      this.selectedSection = 'Maths';   
    }
    else{
      this.selectedSection = 'Physics'; 
    }

    this.currentSection.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);
  }

  onSectionChange(section: string) {
    this.selectedSection = section;
    this.currentSection.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);
  }
}