import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisNavigator } from './analysis-navigator';

describe('AnalysisNavigator', () => {
  let component: AnalysisNavigator;
  let fixture: ComponentFixture<AnalysisNavigator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisNavigator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisNavigator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
