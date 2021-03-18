import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SmeScoreRecordService } from '../../../../_core/_services/sme-score-record.service';
import { ScoreRecordQuestion } from '../../../../_core/_models/score-record-question';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-sme-score-record-edit',
  templateUrl: './sme-score-record-edit.component.html',
  styleUrls: ['./sme-score-record-edit.component.scss']
})
export class SmeScoreRecordEditComponent implements OnInit, OnDestroy {
  questions: ScoreRecordQuestion[] = [];
  recordId: string = '';
  modalRef: BsModalRef;
  imgBase64: any;
  

   //Webcam=========================

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  //==============================

  constructor(private route: ActivatedRoute, private router: Router, private smeScoreRecordService: SmeScoreRecordService,
    private alertifyService: AlertifyService, private modalService: BsModalService,) { }

  ngOnDestroy(): void {
    const questionEditSME = [];
    this.smeScoreRecordService.changeQuestionEditSME(questionEditSME);
  }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.recordId = param['recordId'];
    });
    this.smeScoreRecordService.currentQuestionEditSME.subscribe(res => {
      this.questions = res;
      console.log(this.questions);
    });
  }

  checkChange(item: ScoreRecordQuestion, number) {
    if (number === 0) {
      item.rating_0 = 1;
      item.rating_1 = 0;
      item.rating_2 = 0;
      item.rate_Na = 0;
      item.remark = null;
    }
    if (number === 1) {
      item.rating_0 = 0;
      item.rating_1 = 1;
      item.rating_2 = 0;
      item.rate_Na = 0;
      item.remark = null;
    }
    if (number === 2) {
      item.rating_0 = 0;
      item.rating_1 = 0;
      item.rating_2 = 1;
      item.rate_Na = 0;
      item.remark = null;
    }
    if (number === 3) {
      item.rating_0 = 0;
      item.rating_1 = 0;
      item.rating_2 = 0;
      item.rate_Na = 1;
      item.remark = null;
    }
  }

  back() {
    this.router.navigate(['/maintenance/sme-score-record/detail/' + this.recordId]);
  }

  save() {
    console.log("save", this.questions)
    this.smeScoreRecordService.saveQuestionEditSME(this.questions).subscribe(() => {
      this.alertifyService.success('Save success');
      this.router.navigate(['/maintenance/sme-score-record/detail/' + this.recordId]);
    }, error => {
      this.alertifyService.error(error);
    });
  }

  
  openWebcame(item: ScoreRecordQuestion,template: TemplateRef<any>){
    if(item.rating_0 == 1 || item.rating_1 == 1) {
      item.urlPicture = "";
      this.imgBase64 = "";
        //set time out tránh lỗi webcame set with
        setTimeout(() => {
          this.modalRef = this.modalService.show(template);
        }, 100);
  }
}

 //========== Các hàm xử lý webcam ==========
 public triggerSnapshot(): void {
  // if(num === 2) this.checkBeforePhoto = false;
   this.trigger.next();
 }

 public toggleWebcam(): void {
   this.showWebcam = !this.showWebcam;
 }

 public handleInitError(error: WebcamInitError): void {
   this.errors.push(error); 
 }

 public showNextWebcam(directionOrDeviceId: boolean | string): void {
   // true => move forward through devices
   // false => move backwards through devices
   // string => move to device with given deviceId
   this.nextWebcam.next(directionOrDeviceId);
 }

 public handleImage(item: ScoreRecordQuestion,webcamImage1: WebcamImage): void {
    this.webcamImage = webcamImage1;
    if(item.rating_0 == 1 || item.rating_1 == 1)
    {
      item.urlPicture = webcamImage1.imageAsDataUrl; 
      this.imgBase64 = webcamImage1.imageAsBase64;
      if(this.imgBase64!="" && this.imgBase64 !=undefined && this.imgBase64 !=null) {
        item.upload_Picture = this.imgBase64;
      } else {
        item.upload_Picture = null;
      }
    }
    this.modalRef.hide();
    console.info("received webcam image", webcamImage1);
 }

 public cameraWasSwitched(deviceId: string): void {
   console.log("active device: " + deviceId);
   this.deviceId = deviceId;
 }

 public get triggerObservable(): Observable<void> {
   return this.trigger.asObservable();
 }

 public get nextWebcamObservable(): Observable<boolean | string> {
   return this.nextWebcam.asObservable();
 }
 //==========================================
}
