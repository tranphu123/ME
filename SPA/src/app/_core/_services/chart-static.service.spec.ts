/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChartStaticService } from './chart-static.service';

describe('Service: ChartStatic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartStaticService]
    });
  });

  it('should ...', inject([ChartStaticService], (service: ChartStaticService) => {
    expect(service).toBeTruthy();
  }));
});
