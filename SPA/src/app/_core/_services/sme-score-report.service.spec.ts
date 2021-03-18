/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmeScoreReportService } from './sme-score-report.service';

describe('Service: SmeScoreReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmeScoreReportService]
    });
  });

  it('should ...', inject([SmeScoreReportService], (service: SmeScoreReportService) => {
    expect(service).toBeTruthy();
  }));
});
