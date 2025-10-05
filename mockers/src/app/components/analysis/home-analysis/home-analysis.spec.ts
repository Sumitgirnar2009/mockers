import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAnalysis } from './home-analysis';

describe('HomeAnalysis', () => {
  let component: HomeAnalysis;
  let fixture: ComponentFixture<HomeAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
