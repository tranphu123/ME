import { AuditRateSearch } from "./../../../../_core/_models/audit-rate-search";
import { SmeScoreRecordService } from "./../../../../_core/_services/sme-score-record.service";
import { AlertifyService } from "./../../../../_core/_services/alertify.service";
import { AuditRateSme } from "./../../../../_core/_models/audit-rate-sme";
import {
  Pagination,
  PaginatedResult,
} from "./../../../../_core/_models/pagination";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { FunctionUtility } from "../../../../_core/_utility/function-utility";
import { Select2OptionData } from 'ng-select2';
import { MesOrgService } from '../../../../_core/_services/mes-org.service';
import { AuditTypeService } from '../../../../_core/_services/audit-type.service';

@Component({
  selector: "app-sme-score-record-list",
  templateUrl: "./sme-score-record-list.component.html",
  styleUrls: ["./sme-score-record-list.component.scss"],
})
export class SmeScoreRecordListComponent implements OnInit {
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1,
  };
  timeStart: string = "";
  timeEnd: string = "";
  fromTime: string = "";
  toTime: string = "";
  pdc: string = "all";
  line: string = "all";
  building: string = "all";
  auditType2: string = "";
  issme: string = "isSME";
  pdcList: Array<Select2OptionData>;
  lines: Array<Select2OptionData>;
  buildings: Array<Select2OptionData>;
  auditType2List: Array<Select2OptionData>;
  auditRateSme: AuditRateSme[] = [];
  searchKey = false;
  text: string;
  auditType1s: Array<Select2OptionData>;
  auditType1: string = 'all';
  constructor(
    private smeScoreRecordService: SmeScoreRecordService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private alertify: AlertifyService,
    private functionUtility: FunctionUtility,
    private mesOrgService: MesOrgService,
    private auditTypeMService: AuditTypeService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getListPDCs();
    this.getListBuilding();
    this.getListLine();
    this.getAuditType1();
    this.loadData();
    this.spinner.hide();
  }
  loadData() {
    let object = {
      pdc: this.pdc === 'all' ? '' : this.pdc,
      building: this.building === 'all' ? '' : this.building,
      line: this.line === 'all' ? '' : this.line,
      auditType2: this.auditType2,
      auditType1: this.auditType1 === 'all' ? '' : this.auditType1,
      fromDate: this.fromTime,
      toDate: this.toTime,
    };
    this.smeScoreRecordService
      .search(this.pagination.currentPage, this.pagination.itemsPerPage, object)
      .subscribe(
        (res: PaginatedResult<AuditRateSme[]>) => {
          this.auditRateSme = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
  getListPDCs() {
    this.mesOrgService.getAllPdc().subscribe((res) => {
      this.pdcList = res.map((item) => {
        return { id: item.id, text: item.name };
      });
      this.pdcList.unshift({ id: "all", text: "All" });
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
    const isSME = this.issme ;
    this.mesOrgService.getAllLineIdAuditOrg(pdc, building, isSME)
      .subscribe((res) => {

        this.lines = res.map((item) => {
          return { id: item.id, text: item.name };
        });
        this.lines.unshift({ id: "all", text: "All" });
      });
  }
  optionAuditType2() {
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
  getAuditType1() {
    this.smeScoreRecordService.getAuditType1BySME().subscribe((res) => {
      this.auditType1s = res.map((item) => {
        return { id: item, text: item };
      });
      this.auditType1s.unshift({ id: "all", text: "All" });
    });
  }

  auditType1Change() {
    this.optionAuditType2();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadData();
  }
  pdcChange() {
    this.getListBuilding();
  }
  buingdingChange() {
    this.getListLine();
  }
  addNew() {
    this.router.navigate(["/record/record-add/sms-scored-record-add"]);
  }
  search() {
    this.checkTime();
    this.spinner.show();
    this.pagination.currentPage = 1;
    this.loadData();
    this.spinner.hide();
  }

  detail(recordId) {
    this.router.navigate(["/maintenance/sme-score-record/detail/" + recordId]);
  }

  exportExcel() {
    this.checkTime();
    let object = {
      pdc: this.pdc === 'all' ? '' : this.pdc,
      building: this.building === 'all' ? '' : this.building,
      line: this.line === 'all' ? '' : this.line,
      auditType2: this.auditType2,
      auditType1: this.auditType1 === 'all' ? '' : this.auditType1,
      fromDate: this.fromTime,
      toDate: this.toTime,
    };
    this.smeScoreRecordService.exportExcel(object);
  }

  clearSearch() {
    this.pdc = "all";
    this.building = "all";
    this.line = "all";
    this.auditType1 = "all";
    this.auditType2 = '';
    this.timeEnd = "";
    this.timeStart = "";
    this.fromTime = "";
    this.toTime = "";
    this.loadData();
  }

  checkTime() {
    if (
      this.timeStart === "" ||
      this.timeEnd === "" ||
      this.timeStart === null ||
      this.timeEnd === null ||
      new Date(this.timeStart).getTime() > new Date(this.timeEnd).getTime()
    ) {
      this.toTime = "";
      this.fromTime = "";
    } else {
      this.fromTime = this.functionUtility.getDateFormat(
        new Date(this.timeStart)
      );
      this.toTime = this.functionUtility.getDateFormat(new Date(this.timeEnd));
    }
  }
}
