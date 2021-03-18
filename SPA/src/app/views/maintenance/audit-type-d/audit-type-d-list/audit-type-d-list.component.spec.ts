import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTypeDListComponent } from './audit-type-d-list.component';

describe('AuditTypeDListComponent', () => {
  let component: AuditTypeDListComponent;
  let fixture: ComponentFixture<AuditTypeDListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTypeDListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTypeDListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
