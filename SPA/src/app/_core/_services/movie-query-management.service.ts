import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MovieQuerySeach } from '../_models/movie-query-seach';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { AuditTypeD } from '../_models/audit-type-d';

@Injectable({
  providedIn: 'root'
})
export class MovieQueryManagementService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  search(page?, itemsPerPage?,movieQuerySearch?: MovieQuerySeach): Observable<PaginatedResult<AuditTypeD[]>> {
    const paginatedResult: PaginatedResult<AuditTypeD[]> = new PaginatedResult<AuditTypeD[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    let url = this.baseUrl + 'MovieQueryManagement/moviequerylist';
    return this.http.post<any>(url, movieQuerySearch, { observe: 'response', params })
        .pipe(
          map(response => {
            if (response.headers.get('Pagination') != null) {
              paginatedResult.result = response.body;
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }
            debugger;
            return paginatedResult;

          }),
        );
  }
  GetAllVersion(brand:string) {
    return this.http.get<any>(this.baseUrl + 'MovieQueryManagement/getAllVersion', {params : {
      brand: brand}});
  }
  getAllAuditItem(audittypeID:string) {
    return this.http.get<any>(this.baseUrl + 'MovieQueryManagement/getAllAuditItem', {params : {
      audittypeID:audittypeID}});
  }
  GetAllAudittype(brand:string) {
    return this.http.get<any>(this.baseUrl + 'MovieQueryManagement/getAllAudittype', {params : {
      brand:brand}});
  }
}
