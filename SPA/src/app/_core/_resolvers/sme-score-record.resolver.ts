import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuditType } from '../_models/audit-type';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AuditTypeService } from '../_services/audit-type.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class AuditTypeListResolver implements Resolve<AuditType[]> {
    pageNumber = 1;
    pageSize = 10;
    constructor(private auditTypeService: AuditTypeService, private router: Router, private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<AuditType[]> {
        return this.auditTypeService.getListAll(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return of(null);
            }),
        );
    }
}
