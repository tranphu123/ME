/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShowLineService } from './show-line.service';

describe('Service: ShowLine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowLineService]
    });
  });

  it('should ...', inject([ShowLineService], (service: ShowLineService) => {
    expect(service).toBeTruthy();
  }));
});
