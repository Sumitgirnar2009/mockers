import { TestBed } from '@angular/core/testing';

import { SubmitTestService } from './submit-test-service';

describe('SubmitTestService', () => {
  let service: SubmitTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
