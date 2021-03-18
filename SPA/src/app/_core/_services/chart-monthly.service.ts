import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuditRecSearch } from '../_models/audit-rec-search';

@Injectable({
  providedIn: 'root'
})
export class ChartMonthlyService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getTypes() {
    return this.http.get<any>(this.baseUrl + 'chartMonthly/types/', {});
  }
  getChartByMonthly(param: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'chartMonthly/chartMonthly/',param, {});
  }
  getChartByMonthlyPrevious() {
    return this.http.get<any>(this.baseUrl + 'chartMonthly/getChartPreviousMonth/', {});
  }
  sendMail() {
    return this.http.get<any>(this.baseUrl + 'chartMonthly/sendMail/', {});
  }
  async exportExcel(auditRecSearch: AuditRecSearch)
  {
   return this.http
   .post(
     this.baseUrl + "chartMonthly/ExportExcel",
     auditRecSearch,
     { responseType: "blob" }
   )
   .subscribe((result: Blob) => {
     console.log(result);
     if (result.type !== "application/xlsx") {
       alert(result.type);
     }
     if(result.size==0)
     {
      alert("No data");
       return;
     }
     const blob = new Blob([result]);
     const url = window.URL.createObjectURL(blob);
     const link = document.createElement("a");
     const currentTime = new Date();
     const filename =
       "ImproveProjectRecords_ChartByMonthly_Template" +
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
}
