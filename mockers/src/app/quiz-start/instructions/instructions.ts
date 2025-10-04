import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-instructions',
  imports: [RouterLink],
  templateUrl: './instructions.html',
  styleUrl: './instructions.css'
})
export class Instructions implements OnInit {
  quizId!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('quizId')!;
  }

  goToDeclaration() {
    this.router.navigate(['/declaration', this.quizId]);
  }
}