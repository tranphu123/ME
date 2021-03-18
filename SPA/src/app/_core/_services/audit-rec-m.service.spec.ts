/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditRecMService } from './audit-rec-m.service';

describe('Service: AuditRecM', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditRecMService]
    });
  });

  it('should ...', inject([AuditRecMService], (service: AuditRecMService) => {
    expect(service).toBeTruthy();
  }));
});
