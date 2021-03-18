/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmeScoreReportComponent } from './sme-score-report.component';

describe('SmeScoreReportComponent', () => {
  let component: SmeScoreReportComponent;
  let fixture: ComponentFixture<SmeScoreReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeScoreReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeScoreReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
