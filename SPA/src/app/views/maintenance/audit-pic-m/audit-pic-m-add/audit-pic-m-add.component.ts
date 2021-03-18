import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { AuthService } from '../../../../_core/_services/auth.service';
import { Router } from '@angular/router';
import { AuditPicMService } from '../../../../_core/_services/audit-pic-m.service';

@Component({
  selector: 'app-audit-pic-m-add',
  templateUrl: './audit-pic-m-add.component.html',
  styleUrls: ['./audit-pic-m-add.component.scss']
})
export class AuditPicMAddComponent implements OnInit {
  auditPicM: any = {};
  flag = '100';

  constructor(private auditPicMService: AuditPicMService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.auditPicMService.currentAuditPicM.subscribe(auditPicM => this.auditPicM = auditPicM);
    this.auditPicMService.currentFlag.subscribe(flag => this.flag = flag);
  }
  backList() {
    this.router.navigate(['/maintenance/audit-pic-m']);
  }
  change() {
  }
  saveAndNext() {
    console.log(this.auditPicM);
    if (this.flag === '0') {
      this.auditPicMService.create(this.auditPicM).subscribe( () => {
        this.alertify.success('Add succeed');
        this.auditPicM = {};
      }, error => {
        this.alertify.error(error);
      });
    }
  }
  save() {
    if (this.flag === '0') {
      console.log(this.auditPicM);
      this.auditPicMService.create(this.auditPicM).subscribe( () => {
        this.alertify.success('Add succeed');
        this.router.navigate(['/maintenance/audit-pic-m']);
      }, error => {
        this.alertify.error(error);
      });
    } else {
      this.auditPicMService.update(this.auditPicM).subscribe(
        () => {
          this.alertify.success('Updated succeed');
          this.router.navigate(['/maintenance/audit-pic-m']);
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }
  cancel() {
    this.auditPicM = {};
  }
}
