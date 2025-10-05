import { Routes } from '@angular/router';
import { Homepage } from './components/home/homepage/homepage';
import { Quiz } from './components/quiz/quiz';
import { Instructions } from './quiz-start/instructions/instructions';
import { Declaration } from './quiz-start/declaration/declaration';
import { HomeAnalysis } from './components/analysis/home-analysis/home-analysis';
import { DetailAnalysis } from './components/analysis/detail-analysis/detail-analysis';


export const routes: Routes = [
  { path: 'instructions/:quizId', component: Instructions },
  { path: 'declaration/:quizId', component: Declaration },
  { path: 'attempts-analysis/:quizId', component: HomeAnalysis },
  { path: 'detailAnalysis/:attemptId/:username/:quizId', component: DetailAnalysis },
  { path: '', component: Homepage }, // Default route
  { path: 'home', component: Homepage }, // Default route
  { path: 'quiz/:quizId', component: Quiz },
  { path: '**', redirectTo: '' } // Optional wildcard route for 404 redirect
];




