import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAnalysis } from './detail-analysis';

describe('DetailAnalysis', () => {
  let component: DetailAnalysis;
  let fixture: ComponentFixture<DetailAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
