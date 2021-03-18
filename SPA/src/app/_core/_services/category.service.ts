import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { Category } from '../_models/category';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  }),
};
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  categorySource = new BehaviorSubject<Object>({});
  currentCategory = this.categorySource.asObservable();
  constructor(private http: HttpClient) { }

  getCategories(page?, itemsPerPage?): Observable<PaginatedResult<Category[]>> {
    const paginatedResult: PaginatedResult<Category[]> = new PaginatedResult<Category[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Category[]>(this.baseUrl + 'category', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
      );
  }

  getCategory(id: number) {
    return this.http.get<Category>(this.baseUrl + 'category/' + id, {});
  }

  createCategory(category: Category) {
    return this.http.post(this.baseUrl + 'category/', category);
  }

  changeStatus(id: number) {
    return this.http.post(this.baseUrl + 'category/' + id + '/changeStatus', {});
  }

  updateCategory(category: Category) {
    return this.http.put(this.baseUrl + 'category', category);
  }

  deleteCategory(id: number) {
    return this.http.delete(this.baseUrl + 'category/' + id, {});
  }

  changeCategory(category: Category) {
    this.categorySource.next(category);
  }
}
