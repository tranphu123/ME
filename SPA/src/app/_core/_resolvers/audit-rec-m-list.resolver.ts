import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuditRecMService } from '../_services/audit-rec-m.service';
import { AuditRecM } from '../_models/audit-rec-m';

@Injectable()
export class AuditRecMListResolver implements Resolve<AuditRecM[]> {
    pageNumber = 1;
    pageSize = 10;
    constructor(    private auditRecMService: AuditRecMService,
                    private router: Router,
                    private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<AuditRecM[]> {
        return this.auditRecMService.getListAll(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return of(null);
            }),
        );
    }
}
