import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AuditRecSearch } from "../_models/audit-rec-search";
import { PaginatedResult } from "../_models/pagination";
import { Observable } from "rxjs";
import { AuditRecViewModel } from "../_models/audit-rec-viewmodel";
import { map } from "rxjs/operators";
import * as ExcelJS from "exceljs/dist/exceljs";
import * as fs from "file-saver";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token")
  })
};
@Injectable({
  providedIn: "root"
})
export class AuditRecReportService {
  allAuditRecD: AuditRecViewModel[] = [];
  searchAuditRecD: AuditRecViewModel[] = [];
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  search(
    page?,
    itemsPerPage?,
    auditRecSearch?: AuditRecSearch
  ): Observable<PaginatedResult<AuditRecViewModel[]>> {
    const paginatedResult: PaginatedResult<
      AuditRecViewModel[]
    > = new PaginatedResult<AuditRecViewModel[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    // tslint:disable-next-line:prefer-const
    let url = this.baseUrl + "WTTrackingReport/searchModel/";
    return this.http
      .post<any>(url, auditRecSearch, { observe: "response", params })
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
  async exportExcelDetail(auditRecSearch: AuditRecSearch) {
    let url = this.baseUrl + "WTTrackingReport/SearchExcel/";
    this.http.post<any>(url, auditRecSearch).subscribe(res => {
      const header = [
        "Record_ID",
        "Record_Time",
        "PDC",
        "Building",
        "Line",
        "Model_Name",
        "Model_No",
        "Chief",
        "Recorder",
        "Attendees"
      ];
      const header1 = [
        "Record_ID",
        "Item_No",
        "ERCS",
        "Audit_Type",
        "Audit_Item",
        "Issue_ZW",
        "Issue_LL",
        "Issue_EN",
        "PD_PIC",
        "PD_Department",
        "PD_Building",
        "ME_PIC",
        "Finished_Date",
        "Status",
        "Remark",
        "Updated_By",
        "Updated_Time",
        "Implement_By",
        "Implement_Time"
      ];
      this.allAuditRecD = res;
      this.allAuditRecD.map(item => {
        delete item.audit_Type_ID;
        delete item.before_Picture;
        delete item.after_Picture;
      });
      // tslint:disable-next-line:prefer-const
      let arr = [];
      let arr1 = [];

      this.allAuditRecD.forEach(item => {
        // tslint:disable-next-line:prefer-const
        let bool = false;
        debugger;
        for (let i = 1; i <= arr.length; i++) {
          if (arr[i - 1][0] == item.record_ID) {
            bool = true;
            break;
          }
        }
        let itemConvert = [];
        let itemConvert1 = [];
        if (bool == false) {
          itemConvert[0] = item.record_ID;
          itemConvert[1] = this.dateFormat(item.record_Time);
          itemConvert[2] = item.pdC_Name;
          itemConvert[3] = item.building;
          itemConvert[4] = item.line;
          itemConvert[5] = item.model_Name;
          itemConvert[6] = item.model_No;
          itemConvert[7] = item.chief;
          itemConvert[8] = item.recorder;
          itemConvert[9] = item.attendees;
          arr.push(itemConvert);
        }

        itemConvert1[0] = item.record_ID;
        itemConvert1[1] = item.item_no;
        itemConvert1[2] = item.ercs;
        itemConvert1[3] = item.audit_Type;
        itemConvert1[4] = item.audit_Item;
        itemConvert1[5] = item.issue_ZW;
        itemConvert1[6] = item.issue_LL;
        itemConvert1[7] = item.issue_EN;
        itemConvert1[8] = item.pD_PIC;
        itemConvert1[9] = item.pD_Department;
        itemConvert1[10] = item.pD_Building;
        itemConvert1[11] = item.mE_PIC;
        itemConvert1[12] = this.dateFormat(item.finished_Date);
        itemConvert1[13] = item.status;
        itemConvert1[14] = item.remark;
        itemConvert1[15] = item.updated_By;
        itemConvert1[16] = this.dateFormat(item.updated_Time);
        itemConvert1[17] = item.implement_User;
        itemConvert1[18] = this.dateFormat(item.implement_Time);
        arr1.push(itemConvert1);
      });

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("AuditRecM");
      const worksheet1 = workbook.addWorksheet("AuditRecD");
      // Add header Row
      const headerRow = worksheet.addRow(header);
      const headerRow1 = worksheet1.addRow(header1);
      // Cell Style : Fill and Border
      headerRow.font = {
        size: 12
      };

      // tslint:disable-next-line:variable-name
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "33ff33" },
          bgColor: { argb: "33ff33" }
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
      headerRow1.font = {
        size: 12
      };
      headerRow1.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "33ff33" },
          bgColor: { argb: "33ff33" }
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
      // Add Data and Conditional Formatting
      arr.forEach(d => {
        const row = worksheet.addRow(d);
      });
      arr1.forEach(d => {
        const row = worksheet1.addRow(d);
      });
      worksheet.getColumn(1).width = 17;
      worksheet.getColumn(2).width = 17;
      worksheet.getColumn(3).width = 17;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(6).width = 15;
      worksheet.getColumn(6).width = 13;
      worksheet.getColumn(6).width = 13;
      worksheet.getColumn(10).width = 30;
      worksheet1.getColumn(1).width = 13;
      worksheet1.getColumn(2).width = 10;
      worksheet1.getColumn(4).width = 14;
      worksheet1.getColumn(6).width = 30;
      worksheet1.getColumn(7).width = 30;
      worksheet1.getColumn(8).width = 30;
      worksheet1.getColumn(11).width = 17;
      worksheet1.getColumn(12).width = 20;
      worksheet1.getColumn(13).width = 17;
      worksheet1.getColumn(14).width = 17;
      worksheet1.getColumn(15).width = 17;
      worksheet1.getColumn(16).width = 20;
      worksheet1.getColumn(17).width = 20;
      worksheet1.getColumn(18).width = 20;
      const countAudit = arr1.length;
      for (let i = 1; i < countAudit + 2; i++) {
        worksheet.getCell("J" + i).alignment = { wrapText: true };
        worksheet1.getCell("F" + i).alignment = { wrapText: true };
        worksheet1.getCell("G" + i).alignment = { wrapText: true };
        worksheet1.getCell("H" + i).alignment = { wrapText: true };
        worksheet1.getCell("J" + i).alignment = { wrapText: true };
        worksheet1.getCell("R" + i).alignment = { wrapText: true };
      }
      // Generate Excel File with given name
      // tslint:disable-next-line:no-shadowed-variable
      workbook.xlsx.writeBuffer().then((data: any) => {
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        fs.saveAs(blob, "ME_Detail.xlsx");
      });
    });
  }
  

  async getSearchExcel(auditRecSearch: AuditRecSearch) {
    return this.http
    .post(
      this.baseUrl + "WTTrackingReport/SearchExcel/",
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
        "ME" +
        ".xlsx";
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    });
  }
  async exportWTTracking(auditRecSearch: AuditRecSearch)
  {
   return this.http
   .post(
     this.baseUrl + "WTTrackingReport/ExportExcelWTTrackingList",
     auditRecSearch,
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
       "WT_Tracking_List" +
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
  dateFormat(today: Date) {
    if (today === null || today === undefined) {
      return null;
    } else {
      // tslint:disable-next-line:prefer-const
      let arr = today.toString().split("T");
      // tslint:disable-next-line:prefer-const
      let result = arr[0] + " " + arr[1];
      return result;
    }
  }
  getListStatus() {
    return this.http.get<any>(this.baseUrl + "WTTrackingReport/status", {});
  }
}
