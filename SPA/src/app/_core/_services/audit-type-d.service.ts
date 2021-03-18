import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { AuditTypeD } from '../_models/audit-type-d';
import { map } from 'rxjs/operators';
import { AuditTypeDParam } from '../_models/audit-type-d-param';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  }),
};
@Injectable({
  providedIn: 'root'
})
export class AuditTypeDService {
    baseUrl = environment.apiUrl;
    auditTypeDSource = new BehaviorSubject<Object>({});
    currentAuditType = this.auditTypeDSource.asObservable();
    flagSource = new BehaviorSubject<string>('0');
    currentFlag = this.flagSource.asObservable();
    constructor(private http: HttpClient) { }

    // getListAll(page?, itemsPerPage?): Observable<PaginatedResult<AuditTypeD[]>> {
    //   const paginatedResult: PaginatedResult<AuditTypeD[]> = new PaginatedResult<AuditTypeD[]>();
    //   let params = new HttpParams();
    //   if (page != null && itemsPerPage != null) {
    //     params = params.append('pageNumber', page);
    //     params = params.append('pageSize', itemsPerPage);
    //   }
    //   return this.http.get<AuditTypeD[]>(this.baseUrl + 'auditTypeD', { observe: 'response', params })
    //     .pipe(
    //       map(response => {
    //         console.log(response);
    //         paginatedResult.result = response.body;
    //         if (response.headers.get('Pagination') != null) {
    //           paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
    //         }
    //         return paginatedResult;
    //       }),
    //     );
    // }
    // search(page?, itemsPerPage?, text?): Observable<PaginatedResult<AuditTypeD[]>> {
    //   const paginatedResult: PaginatedResult<AuditTypeD[]> = new PaginatedResult<AuditTypeD[]>();
    //   let params = new HttpParams();
    //   if (page != null && itemsPerPage != null) {
    //     params = params.append('pageNumber', page);
    //     params = params.append('pageSize', itemsPerPage);
    //   }
    //   // tslint:disable-next-line:prefer-const
    //   let url = this.baseUrl + 'auditTypeD/search/' + text;
    //   return this.http.get<AuditTypeD[]>(url , { observe: 'response', params })
    //     .pipe(
    //       map(response => {
    //         console.log(response);
    //         paginatedResult.result = response.body;
    //         if (response.headers.get('Pagination') != null) {
    //           paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
    //         }
    //         return paginatedResult;
    //       }),
    //     );
    // }

    search(page?, itemsPerPage?, auditTypeDSearch?: AuditTypeDParam ): Observable<PaginatedResult<AuditTypeD[]>> {
      const paginatedResult: PaginatedResult<AuditTypeD[]> = new PaginatedResult<AuditTypeD[]>();
      let params = new HttpParams();

      if (page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
      }
      let url = this.baseUrl + 'AuditTypeD/search';
      return this.http.post<any>(url, auditTypeDSearch, { observe: 'response', params })
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




    // searchAuditType(page?, itemsPerPage?, auditType1?, auditType2?): Observable<PaginatedResult<AuditTypeD[]>> {
    //   const paginatedResult: PaginatedResult<AuditTypeD[]> = new PaginatedResult<AuditTypeD[]>();
    //   let params = new HttpParams();
    //   if (page != null && itemsPerPage != null) {
    //     params = params.append('pageNumber', page);
    //     params = params.append('pageSize', itemsPerPage);
    //   }
    //   // tslint:disable-next-line:prefer-const
    //   let url = this.baseUrl + 'auditTypeD/search/' + auditType1 + '/' + auditType2;
    //   return this.http.get<AuditTypeD[]>(url, { observe: 'response', params })
    //     .pipe(
    //       map(response => {
    //         console.log(response);
    //         paginatedResult.result = response.body;
    //         if (response.headers.get('Pagination') != null) {
    //           paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
    //         }
    //         return paginatedResult;
    //       }),
    //     );
    // }

    searchauditItem(auditTypeId: any) {
      return this.http.get<any>(this.baseUrl + 'auditTypeD/auditItem/' + auditTypeId.toString(), {});
    }
    create(auditType: FormData) {
      return this.http.post(this.baseUrl + 'auditTypeD/create/', auditType);
    }
    update(auditType: FormData) {
      return this.http.post(this.baseUrl + 'auditTypeD/edit/', auditType);
    }
    delete(id: number) {
      return this.http.post(this.baseUrl + 'auditTypeD/delete/' + id, {});
    }
    changeAuditType(auditType: AuditTypeD) {
      this.auditTypeDSource.next(auditType);
    }
    changeFlag(flag: string) {
      this.flagSource.next(flag);
    }

    changeVisiable(id: string, item: string) {
      return this.http.post(this.baseUrl + 'auditTypeD/' + id + "/" + item + '/changeVisiable', {});
    }
}
