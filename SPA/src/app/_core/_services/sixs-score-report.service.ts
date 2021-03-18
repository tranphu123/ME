import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { PaginatedResult } from "../_models/pagination";
import { AuditRate6S } from "../_models/audit-rate-6s";
import { map } from "rxjs/operators";
import { AuditRateSearch } from "../_models/audit-rate-search";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token")
  })
};
@Injectable({
  providedIn: "root"
})
export class SixsScoreReportService {
  baseUrl = environment.apiUrl;
  score6SSource = new BehaviorSubject<Object>({});
  currentScore6S = this.score6SSource.asObservable();
  recordId = new BehaviorSubject<string>("0");
  currentRecordId = this.recordId.asObservable();
  questionEditSixsSource = new BehaviorSubject<any>([]);
  currentQuestionEditSixs = this.questionEditSixsSource.asObservable();
  constructor(private http: HttpClient) {}
  search(
    page?,
    itemsPerPage?,
    auditRateSearch?: AuditRateSearch
  ): Observable<PaginatedResult<AuditRate6S[]>> {
    const paginatedResult: PaginatedResult<AuditRate6S[]> = new PaginatedResult<
      AuditRate6S[]
    >();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    let url = this.baseUrl + "SixsReport/sixs-list";
    // return this.http.post<any>(url,auditRateSearch,{params});
    return this.http
      .post<any>(url, auditRateSearch, { observe: "response", params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get("Pagination") != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }
          return paginatedResult;
        })
      );
  }
  exportExcel(auditRateSearch?: AuditRateSearch) {
    return this.http
      .post(this.baseUrl + "SixsReport/ExportExcelSixs", auditRateSearch, {
        responseType: "blob"
      })
      .subscribe((result: Blob) => {
        if (result.type !== "application/xlsx") {
          alert(result.type);
        }
        const blob = new Blob([result]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const currentTime = new Date();
        const filename =
          "6S_Score_Record_" +
          currentTime.getFullYear().toString() +
          (currentTime.getMonth() + 1) +
          currentTime.getDate() +
          currentTime
            .toLocaleTimeString()
            .replace(/[ ]|[,]|[:]/g, "")
            .trim() +
          ".xlsx";
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      });
  }
  exportExcelDetail(recordId: string){
    return this.http.get(this.baseUrl + 'SixsReport/ExportExcelScoreRecordDetail', { responseType: 'blob', params: {
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
        const filename = '6S_Score_Record_Detail_' + currentTime.getFullYear().toString() +
          (currentTime.getMonth() + 1) + currentTime.getDate() +
          currentTime.toLocaleTimeString().replace(/[ ]|[,]|[:]/g, '').trim() + '.xlsx';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
  }
  getAuditType1BySixs() {
    return this.http.get<string[]>(this.baseUrl + 'SixsReport/getaudittype1bysixs');
  }
}
