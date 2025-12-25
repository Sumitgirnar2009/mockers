import { QuestionStatus } from '../service/fetchquestion'; 


export interface QuestionModel {
  attemptId?: string;
  questionId: number;
  selectedOption?: number;
  IsVisited: boolean;
  IsMarkedForReview: boolean;
  IsAnswered: boolean;
  IsSaved?: boolean;
}

export interface QuestionData {
  quizId : string;
  id: number;
  question: QuestionObj;   
  options: OptionObj[];
  correctAnswer: number;
  FullMarks: number;
}

export interface QuestionObj {
  text: string | null;  
  image: string | null;  
}

export interface OptionObj {
  text: string | null;
  image: string | null;  
}



