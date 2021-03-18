import { Component, OnInit } from "@angular/core";
import { AuditTypeDService } from "../../../../_core/_services/audit-type-d.service";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { Router } from "@angular/router";
import { AuditTypeService } from "../../../../_core/_services/audit-type.service";
import { AuditType } from "../../../../_core/_models/audit-type";
import { Select2OptionData } from "ng-select2";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-audit-type-d-add",
  templateUrl: "./audit-type-d-add.component.html",
  styleUrls: ["./audit-type-d-add.component.scss"]
})
export class AuditTypeDAddComponent implements OnInit {
  url_image: any = environment.imageUrl + "no-image.jpg";
  url: any = environment.videoUrl;
  hideVideo: boolean = false;
  filevideo: any;
  constructor(
    private auditTypeDService: AuditTypeDService,
    private alertify: AlertifyService,
    private auditTypeMService: AuditTypeService,
    private router: Router
  ) {}
  auditType: any = {};
  auditTypeM: Array<Select2OptionData>;
  flag = "0";
  ngOnInit(): void {
    this.auditTypeDService.currentAuditType.subscribe(
      auditType => (this.auditType = auditType)
    );
    this.auditTypeDService.currentFlag.subscribe(flag => (this.flag = flag));
    this.getAllAuditTypeM();
    if (
      this.flag == "0" ||
      this.auditType.movie_Name == "" ||
      this.auditType.movie_Name == undefined ||
      this.auditType.movie_Name == null
    ) {
      this.hideVideo = true;
    } else {
      this.url = this.url + this.auditType.movie_Name;
    }
  }
  backList() {
    this.router.navigate(["/maintenance/audit-type-d"]);
  }
  saveAndNext() {
    const formData = new FormData();
    formData.append("filevideo", this.filevideo);
    formData.append("audit_Type_ID", this.auditType.audit_Type_ID);
    formData.append("audit_Item_ID", this.auditType.audit_Item_ID);
    formData.append("audit_Type3_ZW", this.auditType.audit_Type3_ZW==undefined?"":this.auditType.audit_Type3_ZW);
    formData.append("audit_Type3_EN", this.auditType.audit_Type3_EN==undefined?"":this.auditType.audit_Type3_EN);
    formData.append("audit_Type3_LL", this.auditType.audit_Type3_LL==undefined?"":this.auditType.audit_Type3_LL);
    formData.append("audit_Item_EN", this.auditType.audit_Item_EN==undefined?"":this.auditType.audit_Item_EN);
    formData.append("audit_Item_LL", this.auditType.audit_Item_LL==undefined?"":this.auditType.audit_Item_LL);
    formData.append("audit_Item_ZW", this.auditType.audit_Item_ZW==undefined?"":this.auditType.audit_Item_ZW);
    formData.append("rating_0", this.auditType.rating_0);
    formData.append("rating_1", this.auditType.rating_1);
    formData.append("rating_2", this.auditType.rating_2);
    formData.append("updated_By", this.auditType.updated_By);
    // formData.append("updated_Time",this.auditType.updated_Time==undefined?'':this.auditType.updated_Time)
    formData.append(
      "movie_Name",
      this.auditType.movie_Name == null ? "" : this.auditType.movie_Name
    );

    if (this.flag === "0") {
      this.auditTypeDService.create(formData).subscribe(
        () => {
          this.alertify.success("Add succeed");
          this.auditType = {};
        },
        error => {
          this.alertify.error(error);
        }
      );
    } else {
      formData.append(
        "version",
        this.auditType.version == undefined ? 0 : this.auditType.version
      );
      formData.append(
        "visible",
        this.auditType.visible == undefined ? 0 : this.auditType.visible
      );
      this.auditTypeDService.update(formData).subscribe(
        () => {
          this.alertify.success("Updated succeed");
          this.router.navigate(["/maintenance/audit-type-d"]);
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }
  save() {
    const formData = new FormData();
    formData.append("filevideo", this.filevideo);
    formData.append("audit_Type_ID", this.auditType.audit_Type_ID);
    formData.append("audit_Item_ID", this.auditType.audit_Item_ID);
    formData.append("audit_Type3_ZW", this.auditType.audit_Type3_ZW==undefined?"":this.auditType.audit_Type3_ZW);
    formData.append("audit_Type3_EN", this.auditType.audit_Type3_EN==undefined?"":this.auditType.audit_Type3_EN);
    formData.append("audit_Type3_LL", this.auditType.audit_Type3_LL==undefined?"":this.auditType.audit_Type3_LL);
    formData.append("audit_Item_EN", this.auditType.audit_Item_EN==undefined?"":this.auditType.audit_Item_EN);
    formData.append("audit_Item_LL", this.auditType.audit_Item_LL==undefined?"":this.auditType.audit_Item_LL);
    formData.append("audit_Item_ZW", this.auditType.audit_Item_ZW==undefined?"":this.auditType.audit_Item_ZW);
    formData.append("rating_0", this.auditType.rating_0);
    formData.append("rating_1", this.auditType.rating_1);
    formData.append("rating_2", this.auditType.rating_2);
    formData.append("updated_By", this.auditType.updated_By);
    // formData.append("updated_Time",this.auditType.updated_Time==undefined?'':this.auditType.updated_Time)
    formData.append(
      "movie_Name",
      this.auditType.movie_Name == null ? "" : this.auditType.movie_Name
    );
    if (this.flag === "0") {
      this.auditTypeDService.create(formData).subscribe(
        () => {
          this.alertify.success("Add succeed");
          this.auditType = {};
          this.router.navigate(["/maintenance/audit-type-d"]);
        },
        error => {
          this.alertify.error(error);
        }
      );
    } else {
      formData.append(
        "version",
        this.auditType.version == undefined ? 0 : this.auditType.version
      );
      formData.append(
        "visible",
        this.auditType.visible == undefined ? false : this.auditType.visible
      );
      this.auditTypeDService.update(formData).subscribe(
        () => {
          this.alertify.success("Updated succeed");
          this.router.navigate(["/maintenance/audit-type-d"]);
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }
  getAllAuditTypeM() {
    this.auditTypeMService.getAlls().subscribe(
      data => {
        this.auditTypeM = data.map(item => {
          return {
            id: item.audit_Type_ID,
            text: item.audit_Type1 + " - " + item.audit_Type2
          };
        });
        console.log(this.auditType.audit_Type_ID, data);
      },
      error => {
        this.alertify.error(error);
      }
    );
  }
  cancel() {
    this.auditType = {};
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      var file = event.target.files[0];
      var title = event.target.files[0].name.split(".").pop();
      var filesize = event.target.files[0].size;
      if(filesize > 262144000)
      {
        this.alertify.error("video cannot be larger than 250MB")
        return;
      }
      if (title == "mp4" || title == "MP4") {
        reader.onload = event => {
          this.hideVideo = false;
          this.auditType.movie_Name = "";
          this.url = event.target.result;
          this.filevideo = file;
        };
      }
      else
      {
        this.alertify.error("Please choise MP4 file");
      }
    }
  }
}
