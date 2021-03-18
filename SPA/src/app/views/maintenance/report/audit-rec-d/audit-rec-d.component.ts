import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pagination, PaginatedResult } from '../../../../_core/_models/pagination';
import { environment } from "../../../../../environments/environment";
import { AuditRecViewModel } from '../../../../_core/_models/audit-rec-viewmodel';
import { Select2OptionData } from 'ng-select2';
import { AuditRecMService } from '../../../../_core/_services/audit-rec-m.service';
import { AuditTypeService } from '../../../../_core/_services/audit-type.service';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { FunctionUtility } from '../../../../_core/_utility/function-utility';
import { MesOrgService } from '../../../../_core/_services/mes-org.service';
import * as _ from 'lodash';
import { AuditRecReportService } from '../../../../_core/_services/audit-rec-report.service';
@Component({
  selector: 'app-audit-rec-d',
  templateUrl: './audit-rec-d.component.html',
  styleUrls: ['./audit-rec-d.component.scss']
})
export class AuditRecDReportComponent implements OnInit {
  urlImage = environment.imageUrl + "no-image.jpg";
  url: any = environment.imageUrl;
  iswt: string = "isWT";
  auditRecs: AuditRecViewModel[];
  user: any = JSON.parse(localStorage.getItem("user"));
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1,
  };
  text: string;
  searchKey = false;
  reportDate: any;
  statusList: Array<Select2OptionData>;
  buildings: Array<Select2OptionData>;
  lines: Array<Select2OptionData>;
  modelNos: Array<Select2OptionData>;
  pdcList: Array<Select2OptionData>;
  auditType1List: Array<Select2OptionData>;
  auditType2List: Array<Select2OptionData>;
  building: string = "all";
  line: string = "all";
  status: string = "all";
  model_Name: string = "";
  model_No = "all";
  pdc: string = "all";
  auditType1 = "all";
  auditType2: string = "";
  time_start: string = "";
  time_end: string = "";
  timeStart: string = "";
  timeEnd: string = "";
  file_excel: File = null;
  @ViewChild("fileInput", { static: true }) fileInput;
  constructor(
    private auditRecDService: AuditRecReportService,
    private auditRecMService: AuditRecMService,
    private auditTypeMService: AuditTypeService,
    private alertify: AlertifyService,
    private spinner: NgxSpinnerService,
    private functionUtility: FunctionUtility,
    private mesOrgService: MesOrgService
  ) { }

  ngOnInit() {
     this.spinner.show();
    this.getListStatus();
    this.getListPDCs();
    this.getListModelNo();
    this.getAllAuditType1();
    this.load();
  }
  load() {
    this.checkTime();
    let object = {
      pdc: this.pdc === 'all' ? '' : this.pdc,
      status: this.status === 'all' ? '' : this.status,
      building: this.building === 'all' ? '' : this.building,
      line: this.line === 'all' ? '' : this.line,
      model_Name: this.model_Name,
      model_No: this.model_No === 'all' ? '' : this.model_No,
      audit_Type_1: this.auditType1 === 'all' ? '' : this.auditType1,
      audit_Type_2: this.auditType2,
      from_Date: this.timeStart,
      to_Date: this.timeEnd,
    };
    this.auditRecDService
      .search(this.pagination.currentPage, this.pagination.itemsPerPage, object)
      .subscribe(
        (res: PaginatedResult<AuditRecViewModel[]>) => {
          console.log(res);
          this.auditRecs = res.result;
          this.pagination = res.pagination;
          this.spinner.hide();
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
  search() {
    //cho query tìm tất cả
    this.checkTime();
    this.spinner.show();
    this.pagination.currentPage = 1;
    this.load();
    this.spinner.hide();
  }
  exportExcel() {
    this.checkTime();
    // tslint:disable-next-line:prefer-const
    let object = {
      pdc: this.pdc === 'all' ? '' : this.pdc,
      status: this.status === 'all' ? '' : this.status,
      building: this.building === 'all' ? '' : this.building,
      line: this.line === 'all' ? '' : this.line,
      model_Name: this.model_Name,
      model_No: this.model_No === 'all' ? '' : this.model_No,
      audit_Type_1: this.auditType1 === 'all' ? '' : this.auditType1,
      audit_Type_2: this.auditType2,
      from_Date: this.timeStart,
      to_Date: this.timeEnd,
    };
    this.auditRecDService.getSearchExcel(object);
  }
  exportExcelDetail() {
    this.checkTime();
    if (this.line === 'all' || this.line === null || this.line === undefined) {
      this.alertify.error("Please option line !!!");
    } else {
      let object = {
        pdc: this.pdc === 'all' ? '' : this.pdc,
        status: this.status === 'all' ? '' : this.status,
        building: this.building === 'all' ? '' : this.building,
        line: this.line === 'all' ? '' : this.line,
        model_Name: this.model_Name,
        model_No: this.model_No === 'all' ? '' : this.model_No,
      audit_Type_1: this.auditType1 === 'all' ? '' : this.auditType1,
        audit_Type_2: this.auditType2,
        from_Date: this.timeStart,
        to_Date: this.timeEnd,
      };
      this.auditRecDService.exportExcelDetail(object);
    }
  }
  exportExcelWT(){
    this.checkTime();
    if ( this.timeEnd == "" || this.timeStart == "") {
      this.alertify.error("Please option Date !!!");
      return;
    }
    if ( this.time_start > this.time_end || this.time_start < this.time_end) {
      this.alertify.error("Please option in a Date !!!");
      return;
    }
    if (this.pdc === 'all' || this.pdc === null || this.pdc === undefined) {
      this.alertify.error("Please option Department !!!");
      return;
    }
    if (this.building === 'all' || this.building === null || this.building === undefined) {
      this.alertify.error("Please option Building !!!");
      return;
    }
    if (this.line === 'all' || this.line === null || this.line === undefined) {
      this.alertify.error("Please option line !!!");
      return;
    }
    if (this.model_No === 'all' || this.model_No === null || this.model_No === undefined) {
      this.alertify.error("Please option Model No !!!");
      return;
    }
      let object = {
        pdc: this.pdc,
        status: this.status === 'all' ? '' : this.status,
        building:  this.building,
        line:  this.line,
        model_Name: this.model_Name,
        model_No:  this.model_No,
      audit_Type_1: this.auditType1 === 'all' ? '' : this.auditType1,
        audit_Type_2: this.auditType2,
        from_Date: this.timeStart,
        to_Date: this.timeEnd,
      };
      this.auditRecDService.exportWTTracking(object);
  }
  getListStatus() {
    this.auditRecDService.getListStatus().subscribe((res) => {
      this.statusList = res.map((item) => {
        return { id: item, text: item };
      });
      this.statusList.unshift({ id: "all", text: "All" });
    });
  }
  getListModelNo() {
    this.auditRecMService.getListModelNo().subscribe((res) => {
      this.modelNos = res.map((item) => {
        return { id: item, text: item };
      });
      this.modelNos.unshift({ id: "all", text: "All" });
    });
  }

  getAllAuditType1() {
    this.auditTypeMService.getAllAuditType1().subscribe((res) => {
      this.auditType1List = res.map((item) => {
        return { id: item, text: item };
      });
      this.auditType1List.unshift({ id: "all", text: "All" });
    });
  }
  getListPDCs() {
    this.mesOrgService.getAllPdc().subscribe((res) => {
      this.pdcList = res.map((item) => {
        return { id: item.id, text: item.name };
      });
      this.pdcList.unshift({ id: "all", text: "All" });
      this.getListBuilding();
    });
  }
  getListBuilding() {
    const pdc = this.pdc === 'all' ? '' : this.pdc;
    this.mesOrgService.getAllBuilding(pdc).subscribe((res) => {
      this.buildings = res.map((item) => {
        return { id: item.id, text: item.name };
      });
      this.buildings.unshift({ id: "all", text: "All" });
      this.getListLine();
    });
  }
  getListLine() {
    const pdc = this.pdc === 'all' ? '' : this.pdc;
    const building = this.building === 'all' ? '' : this.building;
    const isWT = this.iswt;
    this.mesOrgService.getAllLineIdAuditOrg(pdc, building, isWT)
      .subscribe((res) => {
        this.lines = res.map((item) => {
          return { id: item.id, text: item.name };
        });
        this.lines.unshift({ id: "all", text: "All" });
      });
  }
  // Khi Click chọn option selection Audit Type 1
  optionAuditType1(e) {
    this.auditType1 = e;
    // tslint:disable-next-line:no-var-keyword
    const ọbject = {
      audit_type_1: this.auditType1,
    };
    if (this.auditType1 === "all") {
      this.auditType2List = [];
      this.auditType2 = '';
    } else {
      this.auditTypeMService.getAuditsByAuditType1(ọbject).subscribe((res) => {
        this.auditType2List = res.map((item) => {
          return { id: item.audit_Type2, text: item.audit_Type2 };
        });
        this.auditType2 = this.auditType2List[0].id;
      });
    }
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.load();
  }
  OnDateChange(event): void {
    // tslint:disable-next-line:prefer-const
    let getDate = event.value._i;
    this.reportDate = getDate.year + "/" + getDate.month + "/" + getDate.date;
  }
  pdcChange() {
    this.getListBuilding();
  }
  buingdingChange() {
    this.getListLine();
  }
  checkTime() {
    if (
      this.time_end === "" ||
      this.time_start === "" ||
      this.time_start === null ||
      this.time_end === null ||
      new Date(this.time_start).getTime() > new Date(this.time_end).getTime()
    ) {
      this.timeEnd = "";
      this.timeStart = "";
    } else {
      this.timeStart = this.functionUtility.getDateFormat(
        new Date(this.time_start)
      );
      this.timeEnd = this.functionUtility.getDateFormat(
        new Date(this.time_end)
      );
    }
  }
  chkImage(uploadPicture) {
    if (uploadPicture != null && uploadPicture !== '') {
      if (
        uploadPicture.split(".").pop() == "mp4" ||
        uploadPicture.split(".").pop() == "MP4"
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  openOutlook() {
    // tslint:disable-next-line:prefer-const
    let mailTo =
      "philong.nguyen@shc.ssbshoes.com;nam.nguyen@shc.ssbshoes.com;Quyen.Nguyen@shc.ssbshoes.com;truc.dinh@shc.ssbshoes.com;lan.ho@shc.ssbshoes.com";
    // tslint:disable-next-line:prefer-const
    let subject = "FW: CB FG Tracking Kanban - Export:10.9.0.9:93-Add Modify";
    // tslint:disable-next-line:prefer-const
    let cc = "cuong.huynh@shc.ssbshoes.com";
    // tslint:disable-next-line:prefer-const
    let body =
      "Please help modify the following factory print report format, using the table field.";
    const email = `mailto:${mailTo}?cc=${cc}&subject=${subject}&body=${body}`;
    window.location.href = email;
  }
  openImage(image) {
    if (image != null) {
      window.open(this.url + image, '_blank');
    }
  }
}
