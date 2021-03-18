/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScoreRecordService } from './score-record.service';

describe('Service: ScoreRecord', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreRecordService]
    });
  });

  it('should ...', inject([ScoreRecordService], (service: ScoreRecordService) => {
    expect(service).toBeTruthy();
  }));
});
