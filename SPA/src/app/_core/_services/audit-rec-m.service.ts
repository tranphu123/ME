import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuditRecMAdd } from '../_models/audit-rec-m-add';
import { Observable, BehaviorSubject } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { AuditRecM } from '../_models/audit-rec-m';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  }),
};
@Injectable({
  providedIn: 'root'
})
export class AuditRecMService {
  baseUrl = environment.apiUrl;
  auditRecMSource = new BehaviorSubject<Object>({});
  currentAuditRecM = this.auditRecMSource.asObservable();
  flagSource = new BehaviorSubject<string>('0');
  currentFlag = this.flagSource.asObservable();
  constructor(private http: HttpClient) { }
  getListAll(page?, itemsPerPage?): Observable<PaginatedResult<AuditRecM[]>> {
    const paginatedResult: PaginatedResult<AuditRecM[]> = new PaginatedResult<AuditRecM[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<AuditRecM[]>(this.baseUrl + 'auditRecM/RecMs/', { observe: 'response', params })
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
  getListRecordID() {
    return this.http.get<any>(this.baseUrl + 'auditRecM/recordIDs', {});
  }
  getListBuilding() {
    return this.http.get<any>(this.baseUrl + 'auditRecM/buildings', {});
  }
  getListLine() {
    return this.http.get<any>(this.baseUrl + 'auditRecM/lines', {});
  }
  getListModelName() {
    return this.http.get<any>(this.baseUrl + 'auditRecM/modelNames', {});
  }
  getListModelNo() {
    return this.http.get<any>(this.baseUrl + 'auditRecM/modelNos', {});
  }
  getListPDC() {
    return this.http.get<any>(this.baseUrl + 'auditRecM/pdcs', {});
  }
  create(auditRecM: any) {
    return this.http.post(this.baseUrl + 'auditRecM/create', auditRecM);
  }
  update(auditRecM: AuditRecMAdd) {
    return this.http.post(this.baseUrl + 'auditRecM/edit/', auditRecM);
  }
  setStringRecordID(dateString: string) {
    const arrTime = new Date(dateString);
    const year = arrTime.getFullYear().toString();
    const arrYear = year.split('');
    const y = arrYear[2].toString() + arrYear[3].toString();

    const month = (arrTime.getMonth() + 1).toString();
    // tslint:disable-next-line:prefer-const
    let arrMonth = month.split('');
    // tslint:disable-next-line:prefer-const
    let count = arrMonth.length;
    let m = '';
    if (count === 1) {
      m = '0' + month.toString();
    } else {
      m = arrMonth[0].toString() + arrMonth[1].toString();
    }
    return 'REC' + y + m;
  }
  importExcel(files: FormData,userName:string) {
    return this.http.post(this.baseUrl + 'auditRecM/importExcel/'+userName, files);
  }
  changeAuditRecM(auditRecM: AuditRecM) {
    this.auditRecMSource.next(auditRecM);
  }
  changeFlag(flag: string) {
    this.flagSource.next(flag);
  }
  getAuditRecMById(recordID: string){
    return this.http.get(this.baseUrl + 'auditRecM/getbyid/'+recordID);
  }
}
