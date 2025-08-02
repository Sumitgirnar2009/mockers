import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTabs } from './section-tabs';

describe('SectionTabs', () => {
  let component: SectionTabs;
  let fixture: ComponentFixture<SectionTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
