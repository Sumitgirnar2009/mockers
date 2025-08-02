import { TestBed } from '@angular/core/testing';

import { Fetchquestion } from './fetchquestion';

describe('Fetchquestion', () => {
  let service: Fetchquestion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fetchquestion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
