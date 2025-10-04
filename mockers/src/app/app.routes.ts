import { Routes } from '@angular/router';
import { Homepage } from './components/home/homepage/homepage';
import { Quiz } from './components/quiz/quiz';
import { Instructions } from './quiz-start/instructions/instructions';
import { Declaration } from './quiz-start/declaration/declaration';


export const routes: Routes = [
  { path: 'instructions', component: Instructions },
  { path: 'declaration', component: Declaration },
  { path: '', component: Homepage }, // Default route
  { path: 'home', component: Homepage }, // Default route
  { path: 'quiz', component: Quiz },
  { path: '**', redirectTo: '' } // Optional wildcard route for 404 redirect
];
