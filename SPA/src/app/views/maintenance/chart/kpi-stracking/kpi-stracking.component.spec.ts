/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KpiStrackingComponent } from './kpi-stracking.component';

describe('KpiStrackingComponent', () => {
  let component: KpiStrackingComponent;
  let fixture: ComponentFixture<KpiStrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiStrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiStrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
