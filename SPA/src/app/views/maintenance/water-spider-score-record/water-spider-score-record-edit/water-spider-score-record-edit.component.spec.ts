/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WaterSpiderScoreRecordEditComponent } from './water-spider-score-record-edit.component';

describe('WaterSpiderScoreRecordEditComponent', () => {
  let component: WaterSpiderScoreRecordEditComponent;
  let fixture: ComponentFixture<WaterSpiderScoreRecordEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterSpiderScoreRecordEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterSpiderScoreRecordEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
