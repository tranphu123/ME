import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuditRecViewModel } from '../_models/audit-rec-viewmodel';
import { AuditRecDService } from '../_services/audit-rec-d.service';

@Injectable()
export class AuditRecViewModelListResolver implements Resolve<AuditRecViewModel[]> {
    pageNumber = 1;
    pageSize = 10;
    constructor(    private auditRecDService: AuditRecDService,
                    private router: Router,
                    private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<AuditRecViewModel[]> {
        return this.auditRecDService.getListAll(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return of(null);
            }),
        );
    }
}
