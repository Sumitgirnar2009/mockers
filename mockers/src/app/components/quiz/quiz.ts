import { Component, HostListener, inject, signal } from '@angular/core';
import { Legend } from '../legend/legend';
import { Questions } from '../questions/questions';
import { Navigator } from '../navigator/navigator';
import { SectionTabs } from '../section-tabs/section-tabs';
import { Fetchquestion } from '../../service/fetchquestion';
import { QuestionData, QuestionModel } from '../../models/question.model';
import { TimerComponent } from '../timer/timer';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AsyncPipe, NgIf } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { signIn } from '@aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../../service/logged-in-user-service';
import { ModPipe } from '../../mod-pipe';





@Component({
  selector: 'app-quiz',
  imports: [Legend, Questions, Navigator, TimerComponent, SectionTabs, AsyncPipe],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {

  userservice = inject(UserService);
  constructor(private quizService: Fetchquestion) { }




  currentQuestionNumber!: number

  // Signals for section-wise question numbers
  currPhyQuestionNumber = signal<number>(1);
  currChemQuestionNumber = signal<number>(51);
  currMathQuestionNumber = signal<number>(101);

  currentQuestionModel!: QuestionModel;
  currentQuestionData!: QuestionData | null;
  currentSection!: string
  attemptId = signal<string>('');

  private modPipe = new ModPipe(); // instantiate pipe


  ngOnInit() {

    // if authenticated and current quiz not in progress for logged in user, generate new attemptId else retain existing attemptId if not authenticated user, attempt test as guest and generate new attemptId
    if (this.userservice.getIsAuthenticated()) {
      this.userservice.getUser();

      console.log(this.userservice.getUser());

      // if getattemptstatus(username, quizid) == "inprogress" {
      //   this.attemptId.set(existingAttemptId)
      // }

      // else {
      //   this.attemptId.set(uuidv4());
      //   saveattemptidtoDb(username, quizid, this.attemptId())
      // }
    }


    // this.currentQuestionNumber = 1 // Load first question

    const savedQuestionNumber = localStorage.getItem('currentQuestionNumber');

    if (savedQuestionNumber) {
      this.currentQuestionNumber = Number(savedQuestionNumber);
      this.currPhyQuestionNumber.set(Number(this.currPhyQuestionNumber));
      this.currChemQuestionNumber.set(Number(this.currChemQuestionNumber));
      this.currMathQuestionNumber.set(Number(this.currMathQuestionNumber));


    } else {
      this.currentQuestionNumber = 1;
      localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());
      localStorage.setItem('currPhyQuestionNumber', this.currPhyQuestionNumber().toString());
      localStorage.setItem('currChemQuestionNumber', this.currChemQuestionNumber().toString());
      localStorage.setItem('currMathQuestionNumber', this.currMathQuestionNumber().toString());

    }

    //  return {
    //     questionData,
    //     questionModel
    //   };

    console.log("Current Question Number in ngOnInit: before fetching", this.currentQuestionNumber);


      this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question Details:', err);
        }
      });

    console.log("Current Question in ngOnInit:", this.currentQuestionData, this.currentQuestionModel);
  }




  handleNextQuestion(updatedQuestion: QuestionModel) {
    console.log("Inside handleNextQuestion:");
    this.quizService.saveQuestionStateSnapshot(updatedQuestion, updatedQuestion.id);
    if (this.currentQuestionNumber < 100) {
      this.currentQuestionNumber += 1;
      localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());

      // const { questionData, questionModel } = this.quizService.fetchQuestion(this.currentQuestionNumber);
      // this.currentQuestionData = questionData
      // this.currentQuestionModel = questionModel;

      this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });

      console.log("Current Question in ngOnInit:", this.currentQuestionData, this.currentQuestionModel); if (this.currentQuestionNumber > 50) {
        this.currentSection = "Chemistry"
      }
    }
    console.log("Current Question in ngOnInit:", this.currentQuestionData, this.currentQuestionModel);
  }

  onSelectQuestion(index: number) {
    this.currentQuestionNumber = index;
    localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());
     this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });
  }

  handlePreviousQuestion(questionId: number) {
    if (questionId > 1) {
      this.currentQuestionNumber -= 1;
      localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());

        this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });

      if (this.currentQuestionNumber > 50) {
        this.currentSection = "Chemistry"
      }
      if (this.currentQuestionNumber <= 50) {
        this.currentSection = "Physics"
      }
    }
  }

  handleNavigateQuestion(questionId: number) {
    this.currentQuestionNumber = questionId;
    localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());

       this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });
  }

  handleCurrentSection(section: string) {
    this.currentSection = section
    this.setCurrSecQuesNo(this.currentQuestionNumber)

    if (this.currentSection == "Physics") {
      const phyQ = localStorage.getItem('currPhyQuestionNumber');
      this.currentQuestionNumber = phyQ ? Number(phyQ) : 1;
        this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });
    }

    if (this.currentSection == "Chemistry") {
      // this.currentQuestionNumber = 51;
      const ChemQ = localStorage.getItem('currChemQuestionNumber');
      this.currentQuestionNumber = ChemQ ? Number(ChemQ) : 51;
        this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });
    }
    if (this.currentSection == "Maths") {
      const mathQ = localStorage.getItem('currMathQuestionNumber');
      this.currentQuestionNumber = mathQ ? Number(mathQ) : 101;
   this.quizService.fetchQuestion(this.currentQuestionNumber).subscribe({
        next: ({ questionData, questionModel }) => {
          this.currentQuestionData = questionData;
          this.currentQuestionModel = questionModel;
          console.log('Question Data:', questionData);
          console.log('Question Model:', questionModel);
        },
        error: (err) => {
          console.error('Error fetching question:', err);
        }
      });
    }
  }

  setCurrSecQuesNo(currentQuestionNumber: number) {
    if (currentQuestionNumber >= 1 && currentQuestionNumber <= 50) {
      // Physics
      const phyQ = currentQuestionNumber;
      this.currPhyQuestionNumber.set(phyQ);
      localStorage.setItem("currPhyQuestionNumber", phyQ.toString());
    }
    else if (currentQuestionNumber >= 51 && currentQuestionNumber <= 100) {
      // Chemistry
      const chemQ = currentQuestionNumber;
      this.currChemQuestionNumber.set(chemQ);
      localStorage.setItem("currChemQuestionNumber", chemQ.toString());
    }
    else if (currentQuestionNumber >= 101 && currentQuestionNumber <= 150) {
      // Math
      const mathQ = currentQuestionNumber
      this.currMathQuestionNumber.set(mathQ);
      localStorage.setItem("currMathQuestionNumber", mathQ.toString());
    }
    else {
      console.warn("Invalid question number:", currentQuestionNumber);
    }
  }

  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: BeforeUnloadEvent) {
  //   $event.preventDefault();
  //   $event.returnValue = '⚠️ All data can be lost if you refresh the page.';
  // }


}


// @HostListener('document:contextmenu', ['$event'])
// onRightClick(event: MouseEvent) {
//   event.preventDefault();
// }



