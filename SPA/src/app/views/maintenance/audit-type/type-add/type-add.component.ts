import { Component, OnInit } from "@angular/core";
import { AuditTypeService } from "../../../../_core/_services/audit-type.service";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { AuthService } from "../../../../_core/_services/auth.service";
import { Router } from "@angular/router";
import { BrandService } from "../../../../_core/_services/brand.service";
import { Brand } from "../../../../_core/_models/brand";
import { NgxSpinnerService } from 'ngx-spinner';
import { Select2OptionData } from 'ng-select2';
@Component({
  selector: "app-type-add",
  templateUrl: "./type-add.component.html",
  styleUrls: ["./type-add.component.scss"],
})
export class TypeAddComponent implements OnInit {
  auditType: any = {};
  brands: Array<Select2OptionData>;
  flag = "0";
  auditKinds: Array<Select2OptionData>;
  constructor(
    private auditTypeService: AuditTypeService,
    private alertify: AlertifyService,
    private brandService: BrandService,
    private router: Router,
    private spiner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.auditTypeService.currentAuditType.subscribe(
      (auditType) => (this.auditType = auditType)
    );
    this.auditTypeService.currentFlag.subscribe((flag) => (this.flag = flag));
    this.getAllBrands();
    if (this.flag == '0') {
      this.auditType.version = 1;
    }

    this.auditKinds = [
      { id: 'SME', text: 'SME' },
      { id: '6S', text: '6S' },
      { id: 'WS', text: 'Water Spider' }
    ];
  }

  backList() {
    this.router.navigate(["/maintenance/audit-type"]);
  }

  saveAndNext() {
    if (this.flag == "0") {
      this.auditTypeService.create(this.auditType).subscribe(
        () => {
          this.alertify.success("Add succeed");
          this.auditType = {};
          this.auditType.version = 1;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    } else {
      this.auditTypeService.update(this.auditType).subscribe(
        () => {
          this.alertify.success("Updated succeed");
          this.router.navigate(["/maintenance/audit-type"]);
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    }
  }

  save() {
    if (this.flag == "0") {
      this.auditTypeService.create(this.auditType).subscribe(
        () => {
          this.alertify.success("Add succeed");
          this.router.navigate(["/maintenance/audit-type"]);
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    } else {
      this.auditTypeService.update(this.auditType).subscribe(
        () => {
          this.alertify.success("Updated succeed");
          this.router.navigate(["/maintenance/audit-type"]);
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    }
  }

  getAllBrands() {
    this.brandService.getAllBrands().subscribe(
      (data) => {
        this.brands = data.map(item => {
          return { id: item.brand_ID, text: item.brand_ID + ' - ' + item.brand_EN };
        });
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }
  upgrade() {

    if (this.flag == "1") {
      this.spiner.show();
      this.auditTypeService.upgrade(this.auditType.audit_Type_ID).subscribe(
        () => {
          this.alertify.success("Upgrade Succes");
        },
        (error) => {
          this.alertify.error(error);
        }
      );
      this.spiner.hide();
    }
  }
  cancel() {
    this.auditType = {};
  }
}
