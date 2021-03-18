/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmeStaticChartComponent } from './sme-static-chart.component';

describe('SmeStaticChartComponent', () => {
  let component: SmeStaticChartComponent;
  let fixture: ComponentFixture<SmeStaticChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeStaticChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeStaticChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
