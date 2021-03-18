/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MesOrgService } from './mes-org.service';

describe('Service: MesOrg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MesOrgService]
    });
  });

  it('should ...', inject([MesOrgService], (service: MesOrgService) => {
    expect(service).toBeTruthy();
  }));
});
