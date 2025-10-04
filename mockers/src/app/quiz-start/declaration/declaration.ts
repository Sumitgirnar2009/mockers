import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-declaration',
  imports: [RouterLink,FormsModule],
  templateUrl: './declaration.html',
  styleUrl: './declaration.css'
})
export class Declaration {
  agreed = false;

  quizId!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('quizId')!;
  }

  startQuiz() {
  if (this.agreed) {   // Optional extra check
    this.router.navigate(['/quiz', this.quizId]);
  }
}

}

