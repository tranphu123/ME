/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditPicMService } from './audit-pic-m.service';

describe('Service: AuditPicM', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditPicMService]
    });
  });

  it('should ...', inject([AuditPicMService], (service: AuditPicMService) => {
    expect(service).toBeTruthy();
  }));
});
