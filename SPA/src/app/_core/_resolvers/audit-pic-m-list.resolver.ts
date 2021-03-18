import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuditPicM } from '../_models/audit-pic-m';
import { AuditPicMService } from '../_services/audit-pic-m.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class AuditPicMListResolver implements Resolve<AuditPicM[]> {
    pageNumber = 1;
    pageSize = 10;
    constructor(    private auditPicMService: AuditPicMService,
                    private router: Router,
                    private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<AuditPicM[]> {
        return this.auditPicMService.getListAll(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return of(null);
            }),
        );
    }
}
