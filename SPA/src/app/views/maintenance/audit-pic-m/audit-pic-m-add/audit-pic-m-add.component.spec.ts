import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPicMAddComponent } from './audit-pic-m-add.component';

describe('AuditPicMAddComponent', () => {
  let component: AuditPicMAddComponent;
  let fixture: ComponentFixture<AuditPicMAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPicMAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPicMAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
