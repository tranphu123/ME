import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTypeDAddComponent } from './audit-type-d-add.component';

describe('AuditTypeDAddComponent', () => {
  let component: AuditTypeDAddComponent;
  let fixture: ComponentFixture<AuditTypeDAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTypeDAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTypeDAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
