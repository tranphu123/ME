/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WaterSpiderScoreReportService } from './water-spider-score-report.service';

describe('Service: WaterSpiderScoreReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WaterSpiderScoreReportService]
    });
  });

  it('should ...', inject([WaterSpiderScoreReportService], (service: WaterSpiderScoreReportService) => {
    expect(service).toBeTruthy();
  }));
});
