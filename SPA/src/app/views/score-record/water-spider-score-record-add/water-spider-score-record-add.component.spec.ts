/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WaterSpiderScoreRecordAddComponent } from './water-spider-score-record-add.component';

describe('WaterSpiderScoreRecordAddComponent', () => {
  let component: WaterSpiderScoreRecordAddComponent;
  let fixture: ComponentFixture<WaterSpiderScoreRecordAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterSpiderScoreRecordAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterSpiderScoreRecordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
