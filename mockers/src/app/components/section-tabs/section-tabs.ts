import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Fetchquestion } from '../../service/fetchquestion';
import { Attempt } from '../../service/handle-attempt-id';

@Component({
  selector: 'app-section-tabs',
  standalone: true,
  imports: [],
  templateUrl: './section-tabs.html',
  styleUrl: './section-tabs.css'
})
export class SectionTabs implements OnChanges {
  @Output() currentSectionChange = new EventEmitter<string>();
  @Output() currentQuestion = new EventEmitter<number>();
  @Output() currPhyQues = new EventEmitter<string>();
  @Output() currChemQues = new EventEmitter<string>();
  @Output() currMathsQues = new EventEmitter<string>();
  @Input() attemptId!: string;
  @Input() attemptModel!: Attempt | null
  @Input() quizId!: string
  @Input() currentSection: string | undefined;

  selectedSection: string | undefined;
  constructor(private quizService: Fetchquestion) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSection'] && changes['currentSection'].currentValue) {
      this.selectedSection = changes['currentSection'].currentValue;
    }
  }


  ngOnInit() {

    // forkJoin({
    //   questions: this.quizService.loadAllQuestionsToCache(this.quizId),
    //   snapshots: this.quizService.loadAllSnapshotsToCache(this.attemptId)
    // }).subscribe({
    //   next: () => {
    //     console.log('✅ All questions and snapshots loaded')

    //     const savedQuestionNumber = localStorage.getItem('currentQuestionNumber');
    //     if (savedQuestionNumber && Number(savedQuestionNumber) <= 50) {
    //       this.selectedSection = 'Physics';
    //     } else if (savedQuestionNumber && Number(savedQuestionNumber) > 50 && Number(savedQuestionNumber) <= 100) {
    //       this.selectedSection = 'Chemistry';
    //     }
    //     else if (savedQuestionNumber && Number(savedQuestionNumber) > 100) {
    //       this.selectedSection = 'Maths';
    //     }
    //     else {
    //       this.selectedSection = 'Physics';
    //     }

    //     this.currentSection.emit(this.selectedSection);
    //     console.log("Selected section:", this.selectedSection);
    //   },
    //   error: (err) => console.error('❌ Failed to load data', err)
    // });

    console.log('✅ All questions and snapshots loaded')
    const savedQuestionNumber = localStorage.getItem('currentQuestionNumber');
    if (savedQuestionNumber && Number(savedQuestionNumber) <= 50) {
      this.selectedSection = 'Physics';
    } else if (savedQuestionNumber && Number(savedQuestionNumber) > 50 && Number(savedQuestionNumber) <= 100) {
      this.selectedSection = 'Chemistry';
    }
    else if (savedQuestionNumber && Number(savedQuestionNumber) > 100) {
      this.selectedSection = 'Maths';
    }
    else {
      this.selectedSection = 'Physics';
    }

    // this.onSectionChange(this.selectedSection)
    this.currentSectionChange.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);


  }

  onSectionChange(section: string) {
    this.selectedSection = section;

    if (this.selectedSection === 'Physics') {
      const currQNum = localStorage.getItem('currPhyQuestionNumber') ?? '1'; // fallback to 1
      localStorage.setItem('currentQuestionNumber', currQNum);
    }
    else if (this.selectedSection === 'Chemistry') {
      const currQNum = localStorage.getItem('currChemQuestionNumber') ?? '1'; // fallback to 1
      localStorage.setItem('currentQuestionNumber', currQNum);
    }
    else if (this.selectedSection === 'Maths') {
      const currQNum = localStorage.getItem('currMathsQuestionNumber') ?? '101'; // fallback to 101
      localStorage.setItem('currentQuestionNumber', currQNum);
    }

 
    this.currentSectionChange.emit(this.selectedSection);
    console.log("Selected section:", this.selectedSection);
  }
}