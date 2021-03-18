import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Category } from '../_models/category';
import { CategoryService } from '../_services/category.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CategoryListResolver implements Resolve<Category[]> {
    pageNumber = 1;
    pageSize = 10;
    constructor(private categoryService: CategoryService, private router: Router,
        private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Category[]> {
        console.log('Resolve-->');
        return this.categoryService.getCategories(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/dashboard']);
                return of(null);
            })
        );
    }
}
