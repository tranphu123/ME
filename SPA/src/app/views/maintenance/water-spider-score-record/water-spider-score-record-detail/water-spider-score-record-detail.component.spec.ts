/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WaterSpiderScoreRecordDetailComponent } from './water-spider-score-record-detail.component';

describe('WaterSpiderScoreRecordDetailComponent', () => {
  let component: WaterSpiderScoreRecordDetailComponent;
  let fixture: ComponentFixture<WaterSpiderScoreRecordDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterSpiderScoreRecordDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterSpiderScoreRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
