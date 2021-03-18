/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WaterSpiderScoreRecordListComponent } from './water-spider-score-record-list.component';

describe('WaterSpiderScoreRecordListComponent', () => {
  let component: WaterSpiderScoreRecordListComponent;
  let fixture: ComponentFixture<WaterSpiderScoreRecordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterSpiderScoreRecordListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterSpiderScoreRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
