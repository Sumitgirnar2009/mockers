export interface QuizRecord {
  quizId: string;
  quizName: string;
  quizType: 'free' | 'paid' | 'subscription';
  isProgress : boolean;
  attemptNo: number
}
