import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../service/logged-in-user-service';
import { Attempt } from '../../../service/handle-attempt-id';

@Component({
  selector: 'app-mock-test-display',
  imports: [RouterLink],
  templateUrl: './mock-test-display.html',
  styleUrl: './mock-test-display.css'
})
export class MockTestDisplay {

  constructor(private userService: UserService) { }
  currentQuestionNumber!: number

  pcm_fst1_quizId: string =  "37a81c5d-6362-41e4-aaf3-9d925579f538"
  username!: string
  attemptId = signal<string>('');
  startTime = signal<string>('');
  attemptModel = signal<Attempt | null>(null);

  ngOnInit(): void {
  
      const username = this.userService.getUser().username
      this.username = username


      //check if there is 
    
    }

}
