import { AuditRateM } from './../../../../_core/_models/score-record-question';
import { AuditRateDDetail } from './../../../../_core/_models/score-record-detail';
import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { ScoreRecordService } from '../../../../_core/_services/score-record.service';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { WaterSpiderScoreRecordService } from '../../../../_core/_services/water-spider-score-record.service';
import { AuditPicDService } from '../../../../_core/_services/audit-pic-d.service';

@Component({
  selector: 'app-water-spider-score-record-detail',
  templateUrl: './water-spider-score-record-detail.component.html',
  styleUrls: ['./water-spider-score-record-detail.component.scss']
})
export class WaterSpiderScoreRecordDetailComponent implements OnInit {
  urlNoImage: string = environment.imageUrl + 'no-image.jpg';
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
    model_Name: '',
    model_No: ''
  };
  listAuditRateD: AuditRateDDetail[] = [];
  pdResp:string='';
  mePic:string='';
  buiding:string ='';
  constructor(private alertifyService: AlertifyService,
    private scoreRecordService: ScoreRecordService, private route: ActivatedRoute,
    private router: Router, private waterSpiderService: WaterSpiderScoreRecordService,
    private auditPicDService: AuditPicDService) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.recordId = param['recordId'];
    });
    this.loadData();
  }
  onSelectFile(event, auditItemId) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const title = event.target.files[0].name.split('.').pop();
      const fileZise = event.target.files[0].size;
      const file = event.target.files[0];
      // kiểm tra đuôi file
      if (title === 'jpg' || title === 'jpeg' || title === 'png' || title === 'JPG' || title === 'JPEG' || title === 'PNG') {
        // nếu là hình phải nhỏ hơn 5MB
        if (fileZise <= 20971520) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('recordId', this.recordId);
          formData.append('auditItemId', auditItemId);
          this.waterSpiderService.uploadPicture(formData).subscribe(() => {
            this.loadData();
            this.alertifyService.success(
              'Upload image of ' + auditItemId + ' successfully'
            );
          },
            (error) => {
              this.alertifyService.error(
                'Upload image of ' + auditItemId + ' failed'
              );
            });
            this.loadData();
        }
        else {
          this.alertifyService.error('Images cannot be larger than 20MB');
        }
      }
      else if (title === 'mp4' || title === 'MP4') {
        if (fileZise <= 20971520) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('recordId', this.recordId);
          formData.append('auditItemId', auditItemId);
          this.waterSpiderService.uploadPicture(formData).subscribe(() => {
            this.loadData();
            this.alertifyService.success(
              'Upload video of ' + auditItemId + ' successfully'
            );
          },
            (error) => {
              this.alertifyService.error(
                'Upload video of ' + auditItemId + ' failed'
              );
            });
        }
        else {
          this.alertifyService.error('Video cannot be larger than 20MB');
        }
      }
      else {
        this.alertifyService.error('Incorrect format');
      }
    }
  }

  chkImage(uploadPicture) {
    if (uploadPicture != null) {
      if (
        uploadPicture.split('.').pop() === 'mp4' ||
        uploadPicture.split('.').pop() === 'MP4'
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  loadData() {
    this.waterSpiderService.getDetailScoreRecord(this.recordId).subscribe(res => {
      this.auditRateM = res.auditRateM;
      console.log("res", this.auditRateM)
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
  getBuiding(buiding){
    
    this.auditPicDService.getBuidingByID(buiding).subscribe(res => {
      debugger;
      this.buiding =  res.dataResult;
    });
    console.log(this.buiding);

  }
  getPDRESP(pD_RESP) {
    this.auditPicDService.getPdPicByID(pD_RESP).subscribe(res => {
      this.pdResp =  res.dataResult;
    });

  }
  back() {
    this.router.navigate(['/maintenance/water-spider-score-record'])
  }

  exportExcel() {
    this.waterSpiderService.exportExcelDetail(this.recordId);
  }
  print() {
    window.print();
  }
  edit() {
    const questionEditWaterSpider = this.listAuditRateD.filter(item => {
      return item.ratingNA === 0 && item.rating0 === 0 && item.rating1 === 0 && item.rating2 === 0;
    }).map(itemQues => {
      return {record_ID: this.recordId,
        audit_Item_ID: itemQues.auditItemId,
        quesion: itemQues.auditItemLL,
        quesionEN: itemQues.auditItemEN,
        quesionLL: itemQues.auditItemLL,
        quesionZW: itemQues.auditItemZW};
    });
    this.waterSpiderService.changeQuestionEditWaterSpider(questionEditWaterSpider);
    this.router.navigate(['/maintenance/water-spider-score-record/edit/' + this.recordId]);
  }
}
