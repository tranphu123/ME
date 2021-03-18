/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditTypeDService } from './audit-type-d.service';

describe('Service: AuditTypeD', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditTypeDService]
    });
  });

  it('should ...', inject([AuditTypeDService], (service: AuditTypeDService) => {
    expect(service).toBeTruthy();
  }));
});
