import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRecDAddComponent } from './audit-rec-d-add.component';

describe('AuditRecDAddComponent', () => {
  let component: AuditRecDAddComponent;
  let fixture: ComponentFixture<AuditRecDAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditRecDAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRecDAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
