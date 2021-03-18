import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRecDListComponent } from './audit-rec-d-list.component';

describe('AuditRecDListComponent', () => {
  let component: AuditRecDListComponent;
  let fixture: ComponentFixture<AuditRecDListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditRecDListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRecDListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
