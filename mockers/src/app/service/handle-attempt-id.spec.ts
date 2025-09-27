import { TestBed } from '@angular/core/testing';

import { HandleAttemptId } from './handle-attempt-id';

describe('HandleAttemptId', () => {
  let service: HandleAttemptId;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleAttemptId);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
