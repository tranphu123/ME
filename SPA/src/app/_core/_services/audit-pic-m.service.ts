import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';
import { AuditPicM } from '../_models/audit-pic-m';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  }),
};
@Injectable({
  providedIn: 'root'
})
export class AuditPicMService {
  baseUrl = environment.apiUrl;
  auditPicMSource = new BehaviorSubject<Object>({});
  currentAuditPicM = this.auditPicMSource.asObservable();
  flagSource = new BehaviorSubject<string>('0');
  currentFlag = this.flagSource.asObservable();
  constructor(private http: HttpClient) { }

   // Lấy hết pic M có trong database có phân trang
  getListAll(page?, itemsPerPage?): Observable<PaginatedResult<AuditPicM[]>> {
    const paginatedResult: PaginatedResult<AuditPicM[]> = new PaginatedResult<AuditPicM[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<AuditPicM[]>(this.baseUrl + 'auditPicM', { observe: 'response', params })
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
  search(page?, itemsPerPage?, text?): Observable<PaginatedResult<AuditPicM[]>> {
    const paginatedResult: PaginatedResult<AuditPicM[]> = new PaginatedResult<AuditPicM[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<AuditPicM[]>(this.baseUrl + 'auditPicM/search/' + text, { observe: 'response', params })
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
  create(auditPicM: AuditPicM) {
    return this.http.post(this.baseUrl + 'auditPicM/create/', auditPicM);
  }
  delete(id: string) {
    return this.http.post(this.baseUrl + 'auditPicM/delete/' + id, {});
  }
  update(auditPicM: AuditPicM) {
    return this.http.post(this.baseUrl + 'auditPicM/edit/', auditPicM);
  }
  // Lấy hết pic M có trong database không phân trang
  getAlls(): Observable<AuditPicM[]> {
    return this.http.get<AuditPicM[]>(this.baseUrl + 'auditPicM/all', {});
  }
  changeAuditPicM(auditPicM: AuditPicM) {
    this.auditPicMSource.next(auditPicM);
  }
  changeFlag(flag: string) {
    this.flagSource.next(flag);
  }
}
