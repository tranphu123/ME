/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SixsScoreReportService } from './sixs-score-report.service';

describe('Service: SixsScoreReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SixsScoreReportService]
    });
  });

  it('should ...', inject([SixsScoreReportService], (service: SixsScoreReportService) => {
    expect(service).toBeTruthy();
  }));
});
