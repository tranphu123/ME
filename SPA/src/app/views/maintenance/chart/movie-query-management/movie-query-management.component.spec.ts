import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieQueryManagementComponent } from './movie-query-management.component';

describe('MovieQueryManagementComponent', () => {
  let component: MovieQueryManagementComponent;
  let fixture: ComponentFixture<MovieQueryManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieQueryManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieQueryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
