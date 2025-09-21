export interface SectionLegend {
  answered: number;
  notAnswered: number;
  notVisited: number;
  markedForReview: number;
  answeredAndMarked: number;
}
export interface AllSectionsLegend {
  physics: SectionLegend;
  chemistry: SectionLegend;
  maths: SectionLegend;
  total: SectionLegend;
}