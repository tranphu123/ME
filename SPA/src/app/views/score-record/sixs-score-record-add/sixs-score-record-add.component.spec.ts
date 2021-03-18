/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SixsScoreRecordAddComponent } from './sixs-score-record-add.component';

describe('SixsScoreRecordAddComponent', () => {
  let component: SixsScoreRecordAddComponent;
  let fixture: ComponentFixture<SixsScoreRecordAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SixsScoreRecordAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SixsScoreRecordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
