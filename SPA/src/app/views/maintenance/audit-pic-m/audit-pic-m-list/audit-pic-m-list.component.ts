import { Component, OnInit } from '@angular/core';
import { AuditPicMService } from '../../../../_core/_services/audit-pic-m.service';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pagination, PaginatedResult } from '../../../../_core/_models/pagination';
import { User } from '../../../../_core/_models/user';
import { AuditPicM } from '../../../../_core/_models/audit-pic-m';

@Component({
  selector: 'app-audit-pic-m-list',
  templateUrl: './audit-pic-m-list.component.html',
  styleUrls: ['./audit-pic-m-list.component.scss']
})
export class AuditPicMListComponent implements OnInit {
  auditPics: AuditPicM[];
  auditPic: any = {};
  user: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  text: string;
  searchKey = false;
  constructor(private auditPicMService: AuditPicMService,
              private alertify: AlertifyService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.spinner.show();
    this.auditPicMService.currentAuditPicM.subscribe(auditPic => this.auditPic = auditPic);
    this.route.data.subscribe(data => {
      console.log(data);
      this.spinner.hide();
      this.auditPics = data['auditPics'].result;
      this.pagination = data['auditPics'].pagination;
    });
  }
  load() {
    if (this.searchKey === false) {
      this.auditPicMService.getListAll(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<AuditPicM[]>) => {
        this.auditPics = res.result;
        this.pagination = res.pagination;
        //    this.spinner.hide();
      }, error => {
        this.alertify.error(error);
      });
    } else {
      this.auditPicMService.search(this.pagination.currentPage, this.pagination.itemsPerPage, this.text)
        .subscribe((res: PaginatedResult<AuditPicM[]>) => {
          this.auditPics = res.result;
          this.pagination = res.pagination;
        }, error => {
          this.alertify.error(error);
        });
    }
  }
  delete(auditPicM: AuditPicM) {
    this.alertify.confirm('Delete Audit Pic M', 'Are you sure you want to delete this Pic ID "' + auditPicM.piC_Type_ID + '" ?', () => {
      this.auditPicMService.delete(auditPicM.piC_Type_ID).subscribe(() => {
        this.load();
        this.alertify.success('Audit Pic M has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the Audit Pic M');
      });
    });
  }
  add() {
    this.auditPic = {};
    this.auditPicMService.changeAuditPicM(this.auditPic);
    this.auditPicMService.changeFlag('0');
    this.router.navigate(['/maintenance/audit-pic-m/add']);
  }
  update(auditPicM: AuditPicM) {
    this.auditPicMService.changeAuditPicM(auditPicM);
    this.auditPicMService.changeFlag('1');
    this.router.navigate(['/maintenance/audit-pic-m/update']);
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.load();
  }
  search() {
    if (this.text !== '') {
      this.searchKey = true;
      this.auditPicMService.search(this.pagination.currentPage, this.pagination.itemsPerPage, this.text)
        .subscribe((res: PaginatedResult<AuditPicM[]>) => {
          this.auditPics = res.result;
          this.pagination = res.pagination;
        }, error => {
          this.alertify.error(error);
        });
    } else {
      this.searchKey = false;
      this.load();
    }
  }
}
