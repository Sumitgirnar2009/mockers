import { TestBed } from '@angular/core/testing';

import { AllQuestionState } from './all-question-state';

describe('AllQuestionState', () => {
  let service: AllQuestionState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllQuestionState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
