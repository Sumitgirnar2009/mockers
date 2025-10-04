import { Routes } from '@angular/router';
import { Homepage } from './components/home/homepage/homepage';
import { Quiz } from './components/quiz/quiz';
import { Instructions } from './quiz-start/instructions/instructions';
import { Declaration } from './quiz-start/declaration/declaration';


export const routes: Routes = [
  { path: 'instructions/:quizId', component: Instructions },
  { path: 'declaration/:quizId', component: Declaration },
  { path: '', component: Homepage }, // Default route
  { path: 'home', component: Homepage }, // Default route
  { path: 'quiz/:quizId', component: Quiz },
  { path: '**', redirectTo: '' } // Optional wildcard route for 404 redirect
];



