import { AuditTypeD } from '../_models/audit-type-d';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuditTypeDService } from '../_services/audit-type-d.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class AuditTypeDListResolver implements  Resolve<AuditTypeD[]> {
    pageNumber = 1;
    pageSize = 10;
    constructor(private auditTypeDService: AuditTypeDService, private router: Router, private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<AuditTypeD[]> {
        return this.auditTypeDService.search(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return of(null);
            }),
        );
    }
}
