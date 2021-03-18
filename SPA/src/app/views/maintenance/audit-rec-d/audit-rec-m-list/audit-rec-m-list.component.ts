import { Component, OnInit } from '@angular/core';
import { AuditRecMService } from '../../../../_core/_services/audit-rec-m.service';
import { Pagination } from '../../../../_core/_models/pagination';
import { AuditRecM } from '../../../../_core/_models/audit-rec-m';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-audit-rec-m-list',
  templateUrl: './audit-rec-m-list.component.html',
  styleUrls: ['./audit-rec-m-list.component.scss']
})
export class AuditRecMListComponent implements OnInit {
  auditRecMs: AuditRecM[];
  pagination: Pagination;
  constructor(private auditRecMService: AuditRecMService,
              private alertify: AlertifyService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.route.data.subscribe(data => {
      console.log(data);
      this.spinner.hide();
      this.auditRecMs = data['auditRecMs'].result;
      this.pagination = data['auditRecMs'].pagination;
    });
  }
  load() {
    this.auditRecMService.getListAll(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(res => {
      this.auditRecMs = res.result;
      this.pagination = res.pagination;
    });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.load();
  }
  add() {
    var AuditRecM:any =[];
    this.auditRecMService.changeFlag('0')
    this.auditRecMService.changeAuditRecM(AuditRecM);
    this.router.navigate(['/maintenance/audit-rec/add-audit-recM']);
  }
  update(AuditRecM){
    this.auditRecMService.changeFlag('1')
    this.auditRecMService.changeAuditRecM(AuditRecM);
    this.router.navigate(['/maintenance/audit-rec/update-audit-recM']);
  }
  back(){
    this.router.navigate(["/maintenance/audit-rec"]);
  }
}
