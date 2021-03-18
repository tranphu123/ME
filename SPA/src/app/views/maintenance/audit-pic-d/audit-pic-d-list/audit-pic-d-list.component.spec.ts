import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPicDListComponent } from './audit-pic-d-list.component';

describe('AuditPicDListComponent', () => {
  let component: AuditPicDListComponent;
  let fixture: ComponentFixture<AuditPicDListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPicDListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPicDListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
