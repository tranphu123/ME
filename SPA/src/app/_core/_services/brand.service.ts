import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { Brand } from '../_models/brand';
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
export class BrandService {
  baseUrl = environment.apiUrl;
  brandSource = new BehaviorSubject<Object>({});
  currentBrand = this.brandSource.asObservable();
  flagSource = new BehaviorSubject<string>('0');
  currentFlag = this.flagSource.asObservable();
  constructor(private http: HttpClient) { }

  getBrands(page?, itemsPerPage?): Observable<PaginatedResult<Brand[]>> {
    const paginatedResult: PaginatedResult<Brand[]> = new PaginatedResult<Brand[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<Brand[]>(this.baseUrl + 'brand', { observe: 'response', params})
      .pipe(
        map(response => {
          console.log(response);
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
      );
  }

  search(page?, itemsPerPage?, text?): Observable<PaginatedResult<Brand[]>> {
    const paginatedResult: PaginatedResult<Brand[]> = new PaginatedResult<Brand[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }


    return this.http.get<Brand[]>(this.baseUrl + 'brand/search/' + text, { observe: 'response', params})
      .pipe(
        map(response => {
          console.log(response);
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
      );
  }

  createBrand(brand: Brand) {
    console.log(httpOptions);
    return this.http.post(this.baseUrl +  'brand/create/', brand);
  }

  getAllBrands() {
    return this.http.get<Brand[]>(this.baseUrl + 'brand/all', {});
  }

  changeStatus(id: number) {
    return this.http.post(this.baseUrl + 'brand/' + id + '/changeStatus', {});
  }

  updateBrand(brand: Brand) {
    return this.http.post(this.baseUrl + 'brand/edit/', brand);
  }

  deleteBrand(id: string) {
    return this.http.post(this.baseUrl + 'brand/delete/' + id, {});
  }

  changeBrand(brand: Brand) {
    this.brandSource.next(brand);
  }

  changeFlag(flag: string) {
    this.flagSource.next(flag);
  }

}
