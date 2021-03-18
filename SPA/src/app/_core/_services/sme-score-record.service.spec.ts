/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SmeScoreRecordService } from './sme-score-record.service';

describe('Service: SmeScoreRecord', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmeScoreRecordService]
    });
  });

  it('should ...', inject([SmeScoreRecordService], (service: SmeScoreRecordService) => {
    expect(service).toBeTruthy();
  }));
});
