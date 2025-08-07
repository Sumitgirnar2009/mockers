import { QuestionStatus } from '../service/fetchquestion'; 


export interface QuestionModel {
  id: number;
  text: string;
  options: string[];
  selectedOption?: number;
  IsVisited: boolean;
  IsMarkedForReview: boolean;
  IsAnswered: boolean;
  IsSaved?: boolean; 
}

