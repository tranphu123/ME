import { environment } from "../../../../../environments/environment";
import { AlertifyService } from './../../../../_core/_services/alertify.service';
import { SmeScoreRecordService } from "./../../../../_core/_services/sme-score-record.service";
import { AuditRateDDetail } from "./../../../../_core/_models/score-record-detail";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuditRateM } from './../../../../_core/_models/score-record-question';
import { AuditPicDService } from '../../../../_core/_services/audit-pic-d.service';

@Component({
  selector: "app-sme-score-record-detail",
  templateUrl: "./sme-score-record-detail.component.html",
  styleUrls: ["./sme-score-record-detail.component.scss"],
})
export class SmeScoreRecordDetailComponent implements OnInit {
  url: any = environment.imageUrl;
  recordId: string = '';
  auditRateM: AuditRateM = {
    record_ID: '',
    audit_Type_ID: '',
    pdc: '',
    pdC_Name: '',
    building: '',
    line: '',
    line_ID_2_Name: '',
    audit_Type1: '',
    audit_Type2: '',
    mE_PIC: '',
    pD_RESP: '',
    updated_By: '',
    updated_Time: '',
    record_Date: null,
    halting_Production: false,
    model_No: '',
    model_Name: ''
  };
  listAuditRateD: AuditRateDDetail[];
  pdResp:string='';
  mePic:string='';
  building:string ='';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertifyService: AlertifyService,
    private smeScoreRecordService: SmeScoreRecordService,
    private auditPicDService: AuditPicDService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.recordId = param['recordId'];
    });
    this.loadDetail();
  }

  loadDetail() {
    this.smeScoreRecordService.getDetailScoreRecord(this.recordId).subscribe(res => {
      this.auditRateM = res.auditRateM;
      this.listAuditRateD = res.listAuditRateD;
      this.getMEPIC(this.auditRateM.mE_PIC);
      this.getPDRESP(this.auditRateM.pD_RESP);
      this.getBuiding(this.auditRateM.building);
    });
  }
  getMEPIC(mE_PIC) {

    this.auditPicDService.getMePicByID(mE_PIC).subscribe(res => {
      debugger;
      this.mePic = res.dataResult;
    });
  }
  getPDRESP(pD_RESP) {
    this.auditPicDService.getPdPicByID(pD_RESP).subscribe(res => {
      this.pdResp =  res.dataResult;
    });

  }
  getBuiding(buiding){
 
    this.auditPicDService.getBuidingByID(buiding).subscribe(res => {
      this.building =  res.dataResult;
    });

  }
  exportExcelDetail() {
    this.smeScoreRecordService.exportExcelDetail(this.recordId);
  }

  print() {
    window.print();
  }

  onSelectFile(event, auditItemId) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      var title = event.target.files[0].name.split(".").pop();
      var fileZise = event.target.files[0].size;
      var file = event.target.files[0];
        if (
          title == "jpg" ||
          title == "jpeg"||
          title == "png" ||
          title == "JPG" ||
          title == "JPEG"||
          title == "PNG"
        ) {
        if (fileZise <= 20971520) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("recordId", this.recordId);
          formData.append("auditItemId", auditItemId);
          this.smeScoreRecordService.uploadPicture(formData).subscribe(
            () => {
              this.loadDetail();
              this.alertifyService.success(
                "Upload image of " + auditItemId + " successfully"
              );
            },
            (error) => {
              this.alertifyService.success(
                "Upload image of " + auditItemId + " failed"
              );
            }
          );
          this.loadDetail();
        } else {
          this.alertifyService.error("Images cannot be larger than 20MB");
        }
      } else if (title == "mp4" || title == "MP4") {
        if (fileZise <= 20971520) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("recordId", this.recordId);
          formData.append("auditItemId", auditItemId);
          this.smeScoreRecordService.uploadPicture(formData).subscribe(
            () => {
              this.loadDetail();
              this.alertifyService.success(
                "Upload video of " + auditItemId + " successfully"
              );
            },
            (error) => {
              this.alertifyService.error("Upload video of " + auditItemId + " failed");
            }
          );
        } else {
          this.alertifyService.error("Video cannot be larger than 20MB");
        }
      } else {
        this.alertifyService.error("Incorrect format");
      }
    }
  }
  chkImage(uploadPicture) {
    if (uploadPicture != null) {
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

  back() {
    this.router.navigate(["/maintenance/sme-score-record"]);
  }

  edit() {
    const questionEditSME = this.listAuditRateD.filter(item => {
      return item.ratingNA === 0 && item.rating0 === 0 && item.rating1 === 0 && item.rating2 === 0;
    }).map(itemQues => {
      return {record_ID: this.recordId,
        audit_Item_ID: itemQues.auditItemId,
        quesion: itemQues.auditItemLL,
        quesionEN: itemQues.auditItemEN,
        quesionLL: itemQues.auditItemLL,
        quesionZW: itemQues.auditItemZW,
        typeDrating0:itemQues.typeDrating0,
        typeDrating1:itemQues.typeDrating1,
        typeDrating2:itemQues.typeDrating2};
    });
    this.smeScoreRecordService.changeQuestionEditSME(questionEditSME);
    this.router.navigate(['/maintenance/sme-score-record/edit/' + this.recordId]);
  }
}
