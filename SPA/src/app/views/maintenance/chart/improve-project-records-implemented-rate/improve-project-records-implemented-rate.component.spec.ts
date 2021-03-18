/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImproveProjectRecordsImplementedRateComponent } from './improve-project-records-implemented-rate.component';

describe('ImproveProjectRecordsImplementedRateComponent', () => {
  let component: ImproveProjectRecordsImplementedRateComponent;
  let fixture: ComponentFixture<ImproveProjectRecordsImplementedRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImproveProjectRecordsImplementedRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImproveProjectRecordsImplementedRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
