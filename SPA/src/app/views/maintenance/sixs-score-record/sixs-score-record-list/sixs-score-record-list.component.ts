import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import {
  Pagination,
  PaginatedResult,
} from "../../../../_core/_models/pagination";
import { ScoreRecordService } from "../../../../_core/_services/score-record.service";
import { Router } from "@angular/router";
import { AuditRate6S } from "../../../../_core/_models/audit-rate-6s";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { FunctionUtility } from "../../../../_core/_utility/function-utility";
import { Select2OptionData } from 'ng-select2';
import { MesOrgService } from '../../../../_core/_services/mes-org.service';
import { AuditTypeService } from '../../../../_core/_services/audit-type.service';

@Component({
  selector: "app-sixs-score-record-list",
  templateUrl: "./sixs-score-record-list.component.html",
  styleUrls: ["./sixs-score-record-list.component.scss"],
})
export class SixsScoreRecordListComponent implements OnInit {
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
  is6S: string = "is6S";
  pdcList: Array<Select2OptionData>;
  lines: Array<Select2OptionData>;
  buildings: Array<Select2OptionData>;
  auditType2List: Array<Select2OptionData>;
  auditRate6S: AuditRate6S[] = [];
  auditType1s: Array<Select2OptionData>;
  auditType1: string = 'all';
  constructor(
    private scoreRecordService: ScoreRecordService,
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
    this.getAuditType1();
    this.loadData();
    this.spinner.hide();

  }
  loadData() {
    this.spinner.show();
    let object = {
      pdc: this.pdc === 'all' ? '' : this.pdc,
      building: this.building === 'all' ? '' : this.building,
      line: this.line === 'all' ? '' : this.line,
      auditType2: this.auditType2,
      auditType1: this.auditType1 === 'all' ? '' : this.auditType1,
      fromDate: this.fromTime,
      toDate: this.toTime,
    };
    this.scoreRecordService
      .search(this.pagination.currentPage, this.pagination.itemsPerPage, object)
      .subscribe(
        (res: PaginatedResult<AuditRate6S[]>) => {
          this.auditRate6S = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    this.spinner.hide();
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
    const is6S = this.is6S ;
    this.mesOrgService.getAllLineIdAuditOrg(pdc, building, is6S)
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
    this.scoreRecordService.getAuditType1BySixs().subscribe((res) => {
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
    this.router.navigate(["/record/record-add/6s-scored-record-add"]);
  }
  search() {
    this.checkTime();
    this.spinner.show();
    this.pagination.currentPage = 1;
    this.loadData();
    this.spinner.hide();
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
    this.scoreRecordService.exportExcel(object);
  }
  changeToDetail(recordId) {
    this.scoreRecordService.changeRecordId(recordId);
    this.router.navigate(["maintenance/6s-score-record/detail"]);
  }

  clearSearch() {
    this.pdc = "all";
    this.building = "all";
    this.line = "all";
    this.auditType1 = "all";
    this.auditType2 = '';
    this.timeEnd = "";
    this.timeStart = "";
    this.toTime = "";
    this.fromTime = "";
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
