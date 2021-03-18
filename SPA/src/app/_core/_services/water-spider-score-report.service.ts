import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AuditRateSearch } from "../_models/audit-rate-search";
import { Observable, BehaviorSubject } from "rxjs";
import { PaginatedResult } from "../_models/pagination";
import { AuditRateWaterSpider } from "../_models/audit-rate-water-spider";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class WaterSpiderScoreReportService {
  baseUrl = environment.apiUrl;
  questionEditWaterSpiderSource = new BehaviorSubject<any>([]);
  currentQuestionEditWaterSpider = this.questionEditWaterSpiderSource.asObservable();
  constructor(private http: HttpClient) {}
  search(
    page?,
    itemsPerPage?,
    auditRateSearch?: AuditRateSearch
  ): Observable<PaginatedResult<AuditRateWaterSpider[]>> {
    const paginatedResult: PaginatedResult<
      AuditRateWaterSpider[]
    > = new PaginatedResult<AuditRateWaterSpider[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    let url = this.baseUrl + "WaterSpiderReport/waterspider-list";
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
      .post(
        this.baseUrl + "WaterSpiderReport/ExportExcelWaterSpider",
        auditRateSearch,
        { responseType: "blob" }
      )
      .subscribe((result: Blob) => {
        console.log(result);
        if (result.type !== "application/xlsx") {
          alert(result.type);
        }
        const blob = new Blob([result]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const currentTime = new Date();
        const filename =
          "WaterSpider_Score_Record" +
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
    return this.http.get(this.baseUrl + 'WaterSpiderReport/ExportExcelScoreRecordDetail', { responseType: 'blob', params: {
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
        const filename = 'WaterSpider_Score_Record_Detail_' + currentTime.getFullYear().toString() +
          (currentTime.getMonth() + 1) + currentTime.getDate() +
          currentTime.toLocaleTimeString().replace(/[ ]|[,]|[:]/g, '').trim() + '.xlsx';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
  }

  getAuditType1ByWaterSpider() {
    return this.http.get<string[]>(this.baseUrl + 'WaterSpiderReport/getaudittype1bywaterspider');
  }
}
