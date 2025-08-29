import { QuestionStatus } from '../service/fetchquestion'; 


export interface QuestionModel {
  id: number;
  question: QuestionObj;   
  options: OptionObj[];
  selectedOption?: number;
  IsVisited: boolean;
  IsMarkedForReview: boolean;
  IsAnswered: boolean;
  IsSaved?: boolean;
}

export interface QuestionObj {
  text: string | null;  
  image: string | null;  
}

export interface OptionObj {
  text: string | null;
  image: string | null;  
}



