import { TestBed } from '@angular/core/testing';

import { MovieQueryManagementService } from './movie-query-management.service';

describe('MovieQueryManagementService', () => {
  let service: MovieQueryManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieQueryManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
