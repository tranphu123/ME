/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { 6sScoreReportComponent } from './6s-score-report.component';

describe('6sScoreReportComponent', () => {
  let component: 6sScoreReportComponent;
  let fixture: ComponentFixture<6sScoreReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 6sScoreReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(6sScoreReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
