import { Component, HostListener, inject, NgZone, signal } from '@angular/core';
import { Legend } from '../legend/legend';
import { Questions } from '../questions/questions';
import { Navigator } from '../navigator/navigator';
import { SectionTabs } from '../section-tabs/section-tabs';
import { Fetchquestion } from '../../service/fetchquestion';
import { QuestionData, QuestionModel } from '../../models/question.model';
import { Timer } from '../timer/timer';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AsyncPipe, NgIf } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { signIn } from '@aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../../service/logged-in-user-service';
import { ModPipe } from '../../mod-pipe';
import { delay, forkJoin, of, switchMap, tap } from 'rxjs';
import { Attempt, HandleAttemptId } from '../../service/handle-attempt-id';
import { SubmitTestService } from '../../service/submit-test-service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [Legend, Questions, Navigator, Timer, SectionTabs, NgIf],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {




  // userservice = inject(UserService);
  constructor(private quizService: Fetchquestion, private userService: UserService, private handleAttempt: HandleAttemptId, private submitTestService: SubmitTestService, private router: Router, private ngZone: NgZone, private route: ActivatedRoute) { }

  currentQuestionNumber!: number

  // Signals for section-wise question numbersZZ
  currPhyQuestionNumber = signal<number>(1);
  currChemQuestionNumber = signal<number>(51);
  currMathQuestionNumber = signal<number>(101);

  currentQuestionModel!: QuestionModel;
  currentQuestionData!: QuestionData | null;
  currentSection!: string
  quizId!: string
  username!: string
  attemptId = signal<string>('');
  startTime = signal<string>('');
  attemptModel = signal<Attempt | null>(null);

  isQuizLoading: boolean = true;
  startTimer: boolean = false;
  timerStartTime!: string;      // backend start time
  quizLoadedTime!: Date;        // when all quiz data ready



  private modPipe = new ModPipe(); // instantiate pipe


  ngOnInit(): void {

    // Initialize attemptId

    console.log("Starting quiz for user ", this.userService.getUser().username)

    const username = this.userService.getUser().username
    this.username = username
    this.quizId = this.route.snapshot.paramMap.get('quizId')!;
    console.log('Quiz ID:', this.quizId);

    // Fetch or create attempt on startup

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

    console.log("Before loading all questions", this.currentQuestionNumber);
    this.isQuizLoading = true;

    this.handleAttempt.getOrCreateActiveAttempt(username, this.quizId).pipe(
      tap(attempt => {
        console.log('Attempt loaded in startup component', attempt);
        this.attemptId.set(attempt.attemptId);
        this.startTime.set(attempt.startTime);
        this.attemptModel.set(attempt);
        console.log("Attempt Id for current quiz", this.attemptId(), this.attemptModel(), this.startTime());
      }),
      switchMap(() =>
        forkJoin({
          questions: this.quizService.loadAllQuestionsToCache(this.quizId), // 4s delay
          snapshots: this.quizService.loadAllSnapshotsToCache(this.attemptId())
        })
      )

    ).subscribe({
      next: () => {
        console.log('✅ All questions and snapshots loaded');


        // Now fetch the current question
        console.log("Fetching question on ngOnInit:", this.currentQuestionNumber);
        this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
          next: ({ questionData, questionModel }) => {
            this.currentQuestionData = questionData;
            this.currentQuestionModel = questionModel;

            // ✅ Move log *here*, after data is assigned
            console.log("📌 Current Question in ngOnInit:", this.currentQuestionData, this.currentQuestionModel);

            this.quizLoadedTime = new Date();

            this.isQuizLoading = false;

            setTimeout(() => {
              this.startTimer = true;
            }, 0)

            console.log("⏱ Timer starts from:", this.timerStartTime, "at", this.quizLoadedTime)
          },
          error: (err) => {
            console.error('❌ Error fetching question Details:', err);
          }
        });

      },
      error: (err) => console.error('❌ Failed to load data', err)
    });

    console.log("After initiating load of all questions");

  }

  handleNextQuestion(updatedQuestion: QuestionModel) {
    console.log("Inside handleNextQuestion:", updatedQuestion);

    this.quizService.saveQuestionStateSnapshotToDB(updatedQuestion, updatedQuestion.questionId)
      .subscribe({
        next: () => {
          if (this.currentQuestionNumber < 150) {
            this.currentQuestionNumber += 1;
            localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());

            // const { questionData, questionModel } = this.quizService.fetchQuestion(this.currentQuestionNumber);
            // this.currentQuestionData = questionData
            // this.currentQuestionModel = questionModel;

            this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
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

            console.log(
              "Current Question in ngOnInit:",
              this.currentQuestionData,
              this.currentQuestionModel
            );

            if (this.currentQuestionNumber > 100) {
              this.currentSection = "Maths";
            } else if (this.currentQuestionNumber > 50) {
              this.currentSection = "Chemistry";
            } else {
              this.currentSection = "Physics";
            }

          }
          console.log("Current Question in ngOnInit:", this.currentQuestionData, this.currentQuestionModel);
        },
        error: (err) => console.error("Failed to save snapshot", err)
      });


  }

  onTimeEnd() {
    this.submitTest(true); // skipConfirm = true → submit directly
  }


  onSelectQuestion(index: number) {
    this.currentQuestionNumber = index;
    localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());
    this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
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
    console.log("Inside handlePrevQuestion:", questionId);

    if (questionId > 1) {
      this.currentQuestionNumber -= 1;
      localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());

      this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
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
      if (this.currentQuestionNumber > 100) {
        this.currentSection = "Maths"
      }
    }
  }

  handleNavigateQuestion(questionId: number) {
    this.currentQuestionNumber = questionId;
    localStorage.setItem('currentQuestionNumber', this.currentQuestionNumber.toString());

    this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
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

  handleCurrentQuestion(currentQuestion: number) {
    this.currentQuestionNumber = currentQuestion
  }

  handleCurrentSection(section: string) {
    console.log("Inside handleCurrentSection:", section, this.currentQuestionNumber);
    this.currentSection = section
    this.setCurrSecQuesNo(this.currentQuestionNumber)

    if (this.currentSection == "Physics") {
      const phyQ = localStorage.getItem('currPhyQuestionNumber');
      this.currentQuestionNumber = phyQ ? Number(phyQ) : 1;
      this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
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
      this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
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
      this.quizService.fetchQuestion(this.currentQuestionNumber, this.attemptId()).subscribe({
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

  isLoading = false;

  submitTest(skipConfirm: boolean = false) {
    // Only show confirmation if not skipping
    if (!skipConfirm) {
      const confirmSubmit = window.confirm(
        "⚠️ You are about to submit the test.\n" +
        "Once submitted, you will not be able to attempt it again.\n\n" +
        "Do you want to continue?"
      );

      if (!confirmSubmit) return;
    }

    this.isLoading = true;

    this.submitTestService.submitTest(this.attemptId(), this.username).subscribe({
      next: (res) => {
        this.isLoading = false; // hide spinner

        // Wait for DOM to update before alert
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              localStorage.clear();
              alert(`✅ Test submitted successfully!\nYour marks: ${res}`);
              this.router.navigate(['/home']);
            });
          }, 100); // small delay allows spinner to disappear
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error submitting test', err);
        alert('❌ Failed to submit test. Please try again.');
      }
    });
  }



}




// @HostListener('document:contextmenu', ['$event'])
// onRightClick(event: MouseEvent) {
//   event.preventDefault();
// }



