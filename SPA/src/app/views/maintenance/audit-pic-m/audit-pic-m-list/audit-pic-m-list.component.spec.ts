import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPicMListComponent } from './audit-pic-m-list.component';

describe('AuditPicMListComponent', () => {
  let component: AuditPicMListComponent;
  let fixture: ComponentFixture<AuditPicMListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPicMListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPicMListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
