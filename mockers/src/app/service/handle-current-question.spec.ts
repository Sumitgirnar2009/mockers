import { TestBed } from '@angular/core/testing';

import { HandleCurrentQuestion } from './handle-current-question';

describe('HandleCurrentQuestion', () => {
  let service: HandleCurrentQuestion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleCurrentQuestion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
