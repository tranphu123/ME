import { AuditRateSme } from './../_models/audit-rate-sme';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuditRateSearch } from '../_models/audit-rate-search';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/internal/operators/map';
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  }),
};
@Injectable({
  providedIn: 'root'
})
export class SmeScoreReportService {
  baseUrl = environment.apiUrl;
  questionEditSMESource = new BehaviorSubject<any>([]);
  currentQuestionEditSME = this.questionEditSMESource.asObservable();
constructor(private http: HttpClient) { }
search(page?, itemsPerPage?, auditRateSearch?: AuditRateSearch): Observable<PaginatedResult<AuditRateSme[]>> {
  const paginatedResult: PaginatedResult<AuditRateSme[]> = new PaginatedResult<AuditRateSme[]>();
  let params = new HttpParams();

  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }
  let url = this.baseUrl + 'SMEReport/sme-list';
  return this.http.post<any>(url, auditRateSearch, { observe: 'response', params })
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
exportExcel(auditRateSearch?: AuditRateSearch) {
  return this.http.post(this.baseUrl + 'SMEReport/ExportExcelSME', auditRateSearch, { responseType: 'blob' })
    .subscribe((result: Blob) => {
      if (result.type !== 'application/xlsx') {
        alert(result.type);
      }
      const blob = new Blob([result]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const currentTime = new Date();
      const filename = 'Sme_Score_Record' + currentTime.getFullYear().toString() +
        (currentTime.getMonth() + 1) + currentTime.getDate() +
        currentTime.toLocaleTimeString().replace(/[ ]|[,]|[:]/g, '').trim() + '.xlsx';
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
}
exportExcelDetail(recordId: string){
  return this.http.get(this.baseUrl + 'SMEReport/ExportExcelScoreRecordDetail', { responseType: 'blob', params: {
    recordId: recordId
  } })
    .subscribe((result: Blob) => {
      if (result.type !== 'application/xlsx') {
        alert(result.type);
      }
      const blob = new Blob([result]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const currentTime = new Date();
      const filename = 'Sme_Score_Record_Detail_' + currentTime.getFullYear().toString() +
        (currentTime.getMonth() + 1) + currentTime.getDate() +
        currentTime.toLocaleTimeString().replace(/[ ]|[,]|[:]/g, '').trim() + '.xlsx';
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
}
getAuditType1BySME() {
  return this.http.get<string[]>(this.baseUrl + 'SMEReport/getaudittype1bysme');
}

}
