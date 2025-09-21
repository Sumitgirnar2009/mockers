import { Routes } from '@angular/router';
import { Homepage } from './components/home/homepage/homepage';
import { Quiz } from './components/quiz/quiz';


export const routes: Routes = [
  { path: '', component: Homepage }, // Default route
  { path: 'quiz', component: Quiz },
  { path: '**', redirectTo: '' } // Optional wildcard route for 404 redirect
];
