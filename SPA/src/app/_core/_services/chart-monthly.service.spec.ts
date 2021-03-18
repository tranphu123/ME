import { TestBed } from '@angular/core/testing';

import { ChartMonthlyService } from './chart-monthly.service';

describe('ChartMonthlyService', () => {
  let service: ChartMonthlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartMonthlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
