import { AlertifyService } from "./../../../_core/_services/alertify.service";
import {
  ScoreRecordQuestion,
  AuditRateM,
  AuditRateModel
} from "./../../../_core/_models/score-record-question";
import { MesOrgService } from "./../../../_core/_services/mes-org.service";
import { SmeScoreRecordService } from "./../../../_core/_services/sme-score-record.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { FunctionUtility } from "./../../../_core/_utility/function-utility";
import { ScoreRecordService } from "./../../../_core/_services/score-record.service";
import { Select2OptionData } from "ng-select2";
import { AuditPicDService } from "./../../../_core/_services/audit-pic-d.service";
import { MesMoService } from "./../../../_core/_services/mes-mo.service";
import { getMonth } from "ngx-bootstrap/chronos";
import { WebcamImage, WebcamInitError } from "ngx-webcam";
import { Observable, Subject } from "rxjs";
import { environment } from "../../../../../src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-sme-score-record-add",
  templateUrl: "./sme-score-record-add.component.html",
  styleUrls: ["./sme-score-record-add.component.scss"]
})
export class SmeScoreRecordAddComponent implements OnInit {
  urlImage: any = environment.imageUrl + "no-image.jpg";
  questions: ScoreRecordQuestion[] = [];
  user: any = JSON.parse(localStorage.getItem("user"));
  lang: string = "EN";
  issme: string = "isSME";
  today: Date = new Date();
  recordDate: Date = new Date();
  pdcs: Array<Select2OptionData>;
  buildings: Array<Select2OptionData>;
  lineIDs: Array<Select2OptionData>;
  auditTypes: Array<Select2OptionData>;
  auditTypeID: string;
  btAuditType2: boolean;
  isShow: true;
  pdc: string;
  building: string;
  lineID: string;
  MEPIC: string = "";
  MEPICS: Array<Select2OptionData>;
  PDRESP: string = "";
  PDRESPS: Array<Select2OptionData>;
  isChecked: any = false;
  isDisable: any = false;
  isCheckDisable: any = true;
  brands: Array<Select2OptionData>;
  brand: string;
  modelNos: Array<Select2OptionData>;
  modelNo: string;
  modelName: string;
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
  constructor(
    private router: Router,
    private mesOrgService: MesOrgService,
    private smeScoreRecordService: SmeScoreRecordService,
    private alertifyService: AlertifyService,
    private functionUtility: FunctionUtility,
    private scoreService: ScoreRecordService,
    private auditPicDService: AuditPicDService,
    private mesMoService: MesMoService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.getAllPdc();
    this.getMEPIC();
    this.getPDRESP();
    this.getBrand();
    this.getModelNo();
  }
  getAllPdc() {
    this.mesOrgService.getAllPdc().subscribe(res => {
      this.pdcs = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.pdc = this.pdcs[0].id;
      this.getAllBuilding();
    });
  }
  getAllBuilding() {
    this.mesOrgService.getAllBuilding(this.pdc).subscribe(res => {
      this.buildings = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.building = this.buildings[0].id;
      this.getAllLineId();
    });
  }
  getAllLineId() {
    this.mesOrgService.getAllLineIdAuditOrg(this.pdc, this.building, this.issme).subscribe(res => {
      this.lineIDs = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.lineID = this.lineIDs[0].id;
    });
  }

  getMEPIC() {
    this.auditPicDService.getAllMePic().subscribe(res => {
      this.MEPICS = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.MEPIC = res[0].id;
      this.getLanguage();
    });
  }
  getPDRESP() {
    this.auditPicDService.getAllPdPic().subscribe(res => {
      this.PDRESPS = res.map(item => {
        return { id: item.id, text: item.name };
      });
      this.PDRESP = res[0].id;
    });
  }

  getBrand() {
    this.smeScoreRecordService.getBrandBySME().subscribe(res => {
      this.brands = res.map(item => {
        return { id: item, text: item };
      });
      this.brand = res[0];
    });
  }

  getAuditType() {
    this.smeScoreRecordService
      .getAuditTypeByBrandBySME(this.brand)
      .subscribe(res => {
        this.auditTypes = res.map(item => {
          return {
            id: item.audit_Type_ID,
            text: item.audit_Type1 + " - " + item.audit_Type2
          };
        });
        this.auditTypes.unshift({ id: "all", text: "Select AuditItem" });
        this.auditTypeID = this.auditTypes[0].id;
      });
  }

  getModelNo() {
    this.mesMoService.getModelNo().subscribe(res => {
      this.modelNos = res.map(item => {
        return { id: item, text: item };
      });
      this.modelNo = this.modelNos[0].id;
    });
  }

  changeModelNo() {
    this.mesMoService.getModelName(this.modelNo).subscribe(res => {
      this.modelName = res.dataResult;
    });
  }

  loadQuestion() {
    this.isChecked = false;
    this.smeScoreRecordService.getQuestion(this.auditTypeID).subscribe(res => {
      this.questions = res;
      this.checkHalting(); 
    });
  }

  back() {
    this.router.navigate(["maintenance/sme-score-record"]);
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
  saveAll(check) {
    if (this.auditTypeID == "") {
      this.alertifyService.error("Please option auditType");
    } else {
      let auditRateM = new AuditRateM();
      auditRateM.pdc = this.pdc;
      auditRateM.building = this.building;
      auditRateM.line = this.lineID;
      auditRateM.audit_Type_ID = this.auditTypeID;
      auditRateM.updated_By = this.user.id;
      auditRateM.mE_PIC = this.MEPIC;
      auditRateM.pD_RESP = this.PDRESP;
      auditRateM.model_Name = this.modelName;
      auditRateM.model_No = this.modelNo;
      auditRateM.record_Date = this.functionUtility.returnDayNotTime(
        this.recordDate
      );
      auditRateM.halting_Production = this.isChecked;
     
      let param = new AuditRateModel();
      param.listAuditRateD = this.questions;
      param.auditRateM = auditRateM;
      // kiểm tra phải trả lời hết các câu hỏi mới được lưu
      // for (let index = 0; index < this.questions.length; index++) {
      //   if (this.questions[index].rate_Na === undefined) {
      //     this.alertifyService.error("Please answer all the questions");
      //     return;
      //   }
      // }

      this.smeScoreRecordService.saveScoreRecord(param).subscribe(
        () => {
          if (check == 2) {
            this.router.navigate(["maintenance/sme-score-record"]);
          } else {
            this.questions = [];
            this.isCheckDisable = true;
            this.isDisable = false;
            this.isChecked = false;
          }
          this.alertifyService.success("success");
        },
        error => {
          this.alertifyService.error(error);
        }
      );
     }
  }

  auditTypeChange() {
    this.loadQuestion();
  }
  pdcChange() {
    this.getAllBuilding();
  }
  buingdingChange() {
    this.getAllLineId();
  }
  cancel() {
    this.loadQuestion();
  }
  brandChange() {
    this.getAuditType();
  }
  changeLanguage(event) {
    this.lang = event;
    this.loadQuestion();
    this.isDisable = false;
  }
  getLanguage() {
    this.scoreService.getLanguage(this.MEPIC).subscribe(res => {
      if (
        res[0].language != "" &&
        res[0].language != null &&
        res[0].language != undefined &&
        (res[0].language == "LL" ||
          res[0].language == "EN" ||
          res[0].language == "ZW")
      ) {
        this.lang = res[0].language;
        this.changeLanguage(this.lang);
      } else {
        this.lang = "EN";
        this.changeLanguage(this.lang);
      }
    });
  }
  mepicChange() {
    this.getLanguage();
  }
  haltingProduction() {
    //chọn Halting Production
    if (this.isChecked == true) {
      this.questions.forEach((item, index) => {
        let ele = document.getElementById(index.toString()) as HTMLInputElement;
        ele.checked = true;
        item.rating_0 = 0;
        item.rating_1 = 0;
        item.rating_2 = 0;
        item.rate_Na = 1;
        item.remark = null;
      });
      this.isDisable = true;
    } else {
      this.isDisable = false;
    }
  }
  checkHalting() {
    if (this.questions.length == 0) {
      this.isCheckDisable = true;
      return;
    }
    this.isCheckDisable = false;
  }
  openOutlook() {
    this.scoreService.getListMail(this.lineID).subscribe(res => {
      let listMail = res;
      let stringListMail = '';
      listMail.forEach(element => {
        stringListMail = stringListMail + element.toString() + ';';
      });
      let record_Date = '';
      // if(this.auditRate6S.length > 0) {
      //   let date = this.auditRate6S[0].auditDate;
      //   record_Date = new Date(date).toLocaleDateString("en-US");
      // }
       record_Date = new Date(this.recordDate).toLocaleDateString("en-US");
      let mailTo =  stringListMail;
      let subject =  'SME Audit Result_' + record_Date + ','  + this.pdc + ',' + this.building + ',' + this.lineID 
      let body = `Hi All %0AThis is audit result, please check it, thank you. %0ALink: https://10.4.0.78:3031 `;
      const email = `mailto:${mailTo}&subject=${subject}&body=${body}`;
      window.location.href = email;
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
   
