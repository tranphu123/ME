import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMonthlyComponent } from './chart-monthly.component';

describe('ChartMonthlyComponent', () => {
  let component: ChartMonthlyComponent;
  let fixture: ComponentFixture<ChartMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
