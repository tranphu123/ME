import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPicDAddComponent } from './audit-pic-d-add.component';

describe('AuditPicDAddComponent', () => {
  let component: AuditPicDAddComponent;
  let fixture: ComponentFixture<AuditPicDAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPicDAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPicDAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
