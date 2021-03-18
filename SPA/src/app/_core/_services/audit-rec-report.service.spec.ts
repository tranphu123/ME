/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditRecReportService } from './audit-rec-report.service';

describe('Service: AuditRecReport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditRecReportService]
    });
  });

  it('should ...', inject([AuditRecReportService], (service: AuditRecReportService) => {
    expect(service).toBeTruthy();
  }));
});
