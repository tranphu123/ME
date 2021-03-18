/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditTypeService } from './audit-type.service';

describe('Service: AuditType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditTypeService]
    });
  });

  it('should ...', inject([AuditTypeService], (service: AuditTypeService) => {
    expect(service).toBeTruthy();
  }));
});
