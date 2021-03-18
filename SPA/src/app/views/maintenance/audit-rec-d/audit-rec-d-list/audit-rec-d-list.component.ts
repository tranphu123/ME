import { Component, OnInit } from "@angular/core";
import { AuditRecDService } from "../../../../_core/_services/audit-rec-d.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Pagination } from "../../../../_core/_models/pagination";
import { AuditRecD } from "../../../../_core/_models/audit-rec-d";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-audit-rec-d-list",
  templateUrl: "./audit-rec-d-list.component.html",
  styleUrls: ["./audit-rec-d-list.component.scss"],
})
export class AuditRecDListComponent implements OnInit {
  urlImage = environment.imageUrl + "no-image.jpg";
  url: any = environment.imageUrl;
  auditRecDs: AuditRecD[];
  pagination: Pagination;
  constructor(
    private auditRecDService: AuditRecDService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.route.data.subscribe((data) => {
      this.auditRecDs = data["auditRecDs"].result;
      this.pagination = data["auditRecDs"].pagination;
      this.load();
      this.spinner.hide();
    });
  }
  load() {
    this.auditRecDService
      .getListRecDs(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res) => {
        this.auditRecDs = res.result;
        this.pagination = res.pagination;
      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.load();
  }
  update(auditRecD: AuditRecD) {
    this.auditRecDService.changeFlag("1");
    this.auditRecDService.changeAuditRecD(auditRecD);
    this.router.navigate(["/maintenance/audit-rec/update-audit-recD"]);
  }
  add() {
    var auditRecD: any = {
      status: '',
      finished_Date: '',
      record_ID: '',
      ercs: '',
      audit_Type_ID: '',
      audit_Item: '',
      pD_PIC: '',
      pD_RESP: '',
      mE_PIC: '',
      issue_LL: '',
      issue_EN: '',
      issue_ZW: '',
      remark: '',
      before_Picture: '',
      after_Picture: ''
    };
    this.auditRecDService.changeFlag("0");
    this.auditRecDService.changeAuditRecD(auditRecD);
    this.router.navigate(["/maintenance/audit-rec/add-audit-recD"]);
  }
  back() {
    this.router.navigate(["/maintenance/audit-rec"]);
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
  openImage(image){
    if(image != null)
    {
      window.open(this.url + image, '_blank');
    }
  }
}
