/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditPicDService } from './audit-pic-d.service';

describe('Service: AuditPicD', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditPicDService]
    });
  });

  it('should ...', inject([AuditPicDService], (service: AuditPicDService) => {
    expect(service).toBeTruthy();
  }));
});
