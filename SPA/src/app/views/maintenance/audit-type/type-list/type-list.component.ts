import { Component, OnInit } from '@angular/core';
import { AuditTypeService } from '../../../../_core/_services/audit-type.service';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditType } from '../../../../_core/_models/audit-type';
import { User } from '../../../../_core/_models/user';
import { Pagination, PaginatedResult } from '../../../../_core/_models/pagination';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss']
})
export class TypeListComponent implements OnInit {

  auditTypes: AuditType[];
  auditType: any = {};
  user: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  text: string;
  constructor(private auditTypeService: AuditTypeService,
              private alertify: AlertifyService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.auditTypeService.currentAuditType.subscribe(auditType => this.auditType = auditType);
    this.route.data.subscribe(data => {
      console.log('Data: ', data);
      this.spinner.hide();
      this.auditTypes = data['auditTypes'].result;
      this.pagination = data['auditTypes'].pagination;
    });
    console.log('pa:', this.pagination);
  }

  load() {
    // this.spinner.show();
    this.auditTypeService.getListAll(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResult<AuditType[]>) => {
        this.auditTypes = res.result;
        this.pagination = res.pagination;
        //    this.spinner.hide();
      }, error => {
        this.alertify.error(error);
      });
  }

  search() {
    if (this.text !== '') {
      this.auditTypeService.search(this.pagination.currentPage, this.pagination.itemsPerPage, this.text)
        .subscribe((res: PaginatedResult<AuditType[]>) => {
          this.auditTypes = res.result;
          this.pagination = res.pagination;
          console.log('Search: ', this.auditTypes);
        }, error => {
          this.alertify.error(error);
        });
    } else {
      this.load();
    }
  }

  add() {
    this.auditType = {};
    this.auditTypeService.changeAuditType(this.auditType);
    this.auditTypeService.changeFlag('0');
    this.router.navigate(['/maintenance/audit-type/add']);
  }

  changeToEdit(auditType: AuditType) {
    this.auditTypeService.changeAuditType(auditType);
    this.auditTypeService.changeFlag('1');
    this.router.navigate(['/maintenance/audit-type/update']);
  }

  delete(auditType: AuditType) {
    this.alertify.confirm('Delete Audit Type', 'Are you sure you want to delete this Brand_ID "' + auditType.audit_Type_ID + '" ?', () => {
      this.auditTypeService.delete(auditType.audit_Type_ID).subscribe(() => {
        this.load();
        this.alertify.success('Audit Type has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the Audit Type');
      });
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.load();
  }
}
