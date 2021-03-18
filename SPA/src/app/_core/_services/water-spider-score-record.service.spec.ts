/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WaterSpiderScoreRecordService } from './water-spider-score-record.service';

describe('Service: WaterSpiderScoreRecord', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WaterSpiderScoreRecordService]
    });
  });

  it('should ...', inject([WaterSpiderScoreRecordService], (service: WaterSpiderScoreRecordService) => {
    expect(service).toBeTruthy();
  }));
});
