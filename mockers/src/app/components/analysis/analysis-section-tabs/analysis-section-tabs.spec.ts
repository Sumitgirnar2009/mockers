import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisSectionTabs } from './analysis-section-tabs';

describe('AnalysisSectionTabs', () => {
  let component: AnalysisSectionTabs;
  let fixture: ComponentFixture<AnalysisSectionTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisSectionTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisSectionTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
