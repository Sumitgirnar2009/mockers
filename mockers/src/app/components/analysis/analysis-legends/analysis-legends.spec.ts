import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisLegends } from './analysis-legends';

describe('AnalysisLegends', () => {
  let component: AnalysisLegends;
  let fixture: ComponentFixture<AnalysisLegends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisLegends]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisLegends);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
