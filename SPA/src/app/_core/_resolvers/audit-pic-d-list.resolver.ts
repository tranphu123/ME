import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuditPicD } from '../_models/audit-pic-d';
import { AuditPicDService } from '../_services/audit-pic-d.service';

@Injectable()
export class AuditPicDListResolver implements Resolve<AuditPicD[]> {
    pageNumber = 1;
    pageSize = 10;
    constructor(    private auditPicDService: AuditPicDService,
                    private router: Router,
                    private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<AuditPicD[]> {
        return this.auditPicDService.getListAll(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return of(null);
            }),
        );
    }
}
