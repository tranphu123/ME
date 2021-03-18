/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditRecDService } from './audit-rec-d.service';

describe('Service: AuditRecD', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditRecDService]
    });
  });

  it('should ...', inject([AuditRecDService], (service: AuditRecDService) => {
    expect(service).toBeTruthy();
  }));
});
