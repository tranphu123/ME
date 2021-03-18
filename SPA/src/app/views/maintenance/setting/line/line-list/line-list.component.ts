import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from 'ngx-spinner';
import { MesAuditOrg } from '../../../../../_core/_models/mes-audit-org';
import { ShowLineService } from '../../../../../_core/_services/show-line.service';
import { PaginatedResult, Pagination } from '../../../../../_core/_models/pagination';
import { AlertifyService } from '../../../../../_core/_services/alertify.service';
import { MesOrgService } from '../../../../../_core/_services/mes-org.service';

@Component({
  selector: 'app-line-list',
  templateUrl: './line-list.component.html',
  styleUrls: ['./line-list.component.scss']
})
export class LineListComponent implements OnInit {
  mesAuditOrgs: MesAuditOrg[];
  pdc: string = "all";
  line: string = "";
  building: string = "all";
  pdcList: Array<Select2OptionData>;
  lines : [] = [];
  buildings: Array<Select2OptionData>;
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1
  };
  isCheckDisable: any = true;
  constructor(private spinner: NgxSpinnerService,
              private router: Router,
              private alertify: AlertifyService,
              private mesOrgService: MesOrgService,
              private showLineService: ShowLineService) { }

  ngOnInit() {
    this.spinner.show();
    this.getListPDCs();
    this.getListBuilding();
    this.loadData();
    this.spinner.hide();
  }


  loadData() {
    let object = {
      pdc: this.pdc === 'all' ? '' : this.pdc,
      building: this.building === 'all' ? '' : this.building,
    };
    this.showLineService
      .getListAll(this.pagination.currentPage, this.pagination.itemsPerPage, object)
      .subscribe(
        (res: PaginatedResult<MesAuditOrg[]>) => {
          this.mesAuditOrgs = res.result;
          this.pagination = res.pagination;
          console.log("lan1", this.mesAuditOrgs)
        },
        (error) => {
          this.alertify.error(error);
        }
      );
      console.log("lan", this.mesAuditOrgs)
  }

  checkHalting() {
    if (this.mesAuditOrgs.length == 0) {
      this.isCheckDisable = true;
      return;
    }
    this.isCheckDisable = false;
  }

  pdcChange() {
    this.getListBuilding();
  }

  search() {
    this.spinner.show();
    this.pagination.currentPage = 1;
    this.loadData();
    this.spinner.hide();
  }
  clearSearch() {
    this.pdc = "all";
    this.building = "all";
    this.loadData();
  }

  changeLine(item) {
    this.showLineService.changeLine(item).subscribe((res) => {
      if (res) {
        this.alertify.success("Save success");

      } else {
        this.alertify.error("Save failed");
      }
    });
  }

 
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadData();
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
    });
  }

  getListLine() {
    const pdc = this.pdc === 'all' ? '' : this.pdc;
    const building = this.building === 'all' ? '' : this.building;
    this.mesOrgService.getAllLineId(pdc, building)
      .subscribe((res) => {
        this.lines = res;
      });
      console.log("lan", this.lines)
  }

 
  changeLineWTtracking(item) {
    item.isWT = !item.isWT;
    this.changeLine(item);
  }

  changeLineSMEScore(item) {
    item.isSME = !item.isSME;
    this.changeLine(item);
  }

  changeLineSixScore(item) {
    item.is6S = !item.is6S;
    this.changeLine(item);
  }

  changeLineWaterScore(item) {
    item.isWS = !item.isWS;
    this.changeLine(item);
  }


}
