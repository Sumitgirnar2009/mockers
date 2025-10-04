import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockTestDisplay } from './mock-test-display';

describe('MockTestDisplay', () => {
  let component: MockTestDisplay;
  let fixture: ComponentFixture<MockTestDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockTestDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockTestDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
