/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmeScoreRecordAddComponent } from './sme-score-record-add.component';

describe('SmeScoreRecordAddComponent', () => {
  let component: SmeScoreRecordAddComponent;
  let fixture: ComponentFixture<SmeScoreRecordAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeScoreRecordAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeScoreRecordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
