/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmeScoreRecordListComponent } from './sme-score-record-list.component';

describe('SmeScoreRecordListComponent', () => {
  let component: SmeScoreRecordListComponent;
  let fixture: ComponentFixture<SmeScoreRecordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeScoreRecordListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeScoreRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
