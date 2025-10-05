import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisQuestions } from './analysis-questions';

describe('AnalysisQuestions', () => {
  let component: AnalysisQuestions;
  let fixture: ComponentFixture<AnalysisQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
