export interface QuestionModel {
  id: number;
  text: string;
  options: string[];
  selectedOption?: number;
  visited: boolean;
  markedForReview: boolean;
}

