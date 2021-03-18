/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MesMoService } from './mes-mo.service';

describe('Service: MesMo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MesMoService]
    });
  });

  it('should ...', inject([MesMoService], (service: MesMoService) => {
    expect(service).toBeTruthy();
  }));
});
