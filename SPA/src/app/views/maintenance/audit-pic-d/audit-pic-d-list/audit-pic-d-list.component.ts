import { Component, OnInit } from "@angular/core";
import { AuditPicD } from "../../../../_core/_models/audit-pic-d";
import { User } from "../../../../_core/_models/user";
import {
  Pagination,
  PaginatedResult
} from "../../../../_core/_models/pagination";
import { AuditPicDService } from "../../../../_core/_services/audit-pic-d.service";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-audit-pic-d-list",
  templateUrl: "./audit-pic-d-list.component.html",
  styleUrls: ["./audit-pic-d-list.component.scss"]
})
export class AuditPicDListComponent implements OnInit {
  auditPics: AuditPicD[];
  auditPic: any = {};
  user: User = JSON.parse(localStorage.getItem("user"));
  pagination: Pagination;
  text: string;
  searchKey = false;
  constructor(
    private auditPicDService: AuditPicDService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.auditPicDService.currentAuditPicD.subscribe(
      auditPic => (auditPic = this.auditPic)
    );
    this.route.data.subscribe(data => {
      this.auditPics = data["auditPics"].result;
      this.pagination = data["auditPics"].pagination;
      this.spinner.hide();
    });
  }
  load() {
    if (this.searchKey === false) {
      this.auditPicDService
        .getListAll(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe(
          (res: PaginatedResult<AuditPicD[]>) => {
            this.auditPics = res.result;
            this.pagination = res.pagination;
          },
          error => {
            this.alertify.error(error);
          }
        );
    } else {
      this.auditPicDService
        .search(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.text
        )
        .subscribe(
          (res: PaginatedResult<AuditPicD[]>) => {
            this.auditPics = res.result;
            this.pagination = res.pagination;
          },
          error => {
            this.alertify.error(error);
          }
        );
    }
  }
  delete(auditPicD: AuditPicD) {
    this.alertify.confirm(
      "Delete Audit Pic D",
      'Are you sure you want to delete this Pic ID "' +
        auditPicD.piC_Type_ID +
        '" ?',
      () => {
        this.auditPicDService.delete(auditPicD).subscribe(
          () => {
            this.load();
            this.alertify.success("Audit Pic D has been deleted");
          },
          error => {
            this.alertify.error("Failed to delete the Audit Pic D");
          }
        );
      }
    );
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.load();
  }
  changePageAdd() {
    this.auditPic = {};
    this.auditPicDService.changeAuditPicD(this.auditPic);
    this.auditPicDService.changeFlag("0");
    this.router.navigate(["/maintenance/audit-pic-d/add"]);
  }
  changePageUpdate(auditPic: AuditPicD) {
    this.auditPic = auditPic;
    this.auditPicDService.changeAuditPicD(this.auditPic);
    this.auditPicDService.changeFlag("1");
    this.router.navigate(["/maintenance/audit-pic-d/update"]);
  }
  search() {
    if (this.text !== "") {
      this.searchKey = true;
      this.auditPicDService
        .search(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.text
        )
        .subscribe(
          (res: PaginatedResult<AuditPicD[]>) => {
            this.auditPics = res.result;
            this.pagination = res.pagination;
          },
          error => {
            this.alertify.error(error);
          }
        );
    } else {
      this.searchKey = false;
      this.load();
    }
  }
}
