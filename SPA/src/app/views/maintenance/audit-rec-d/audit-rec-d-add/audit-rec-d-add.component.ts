import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AuditTypeService } from "../../../../_core/_services/audit-type.service";
import { AuditTypeDService } from "../../../../_core/_services/audit-type-d.service";
import { AuditPicDService } from "../../../../_core/_services/audit-pic-d.service";
import { AuditRecDService } from "../../../../_core/_services/audit-rec-d.service";
import { AuditRecMService } from "../../../../_core/_services/audit-rec-m.service";
import { Router } from "@angular/router";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { environment } from "../../../../../environments/environment";
import { FunctionUtility } from "../../../../_core/_utility/function-utility";
import { Select2OptionData } from "ng-select2";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { Observable, Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: "app-audit-rec-d-add",
  templateUrl: "./audit-rec-d-add.component.html",
  styleUrls: ["./audit-rec-d-add.component.css"],
})
export class AuditRecDAddComponent implements OnInit {
  urlImage: any = environment.imageUrl + "no-image.jpg";
  url_after: any = environment.imageUrl;
  url_before: any = environment.imageUrl;
  auditRecD: any = {};
  flag: string;
  recordIDs: Array<Select2OptionData>;
  auditType: Array<Select2OptionData>;
  auditItems: any = [];
  pdPics: Array<Select2OptionData>;
  mePics: Array<Select2OptionData>;
  pdDepartment: string = "";
  pdBuilding: string = "";
  audit_Item: string;
  fileImageB4: any;
  fileImageAfter: any;
  imgBase64Before: any;
  imgBase64After: any;
  changDate: boolean = false;
  date: Date;
  formData: any;
  checkBeforePhoto: boolean = true;I
  modalRef: BsModalRef;

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
    private auditTypeMService: AuditTypeService,
    private auditTypeDService: AuditTypeDService,
    private auditPicDService: AuditPicDService,
    private auditRecDService: AuditRecDService,
    private auditRecMService: AuditRecMService,
    private router: Router,
    private alertifyService: AlertifyService,
    private functionUtility: FunctionUtility,
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.auditRecDService.auditRecDSource.subscribe(
      (auditRecD) => (this.auditRecD = auditRecD)
    );
    this.auditRecDService.flagSource.subscribe((flag) => (this.flag = flag));
    if (
      this.auditRecD.after_Picture !== undefined &&
      this.auditRecD.after_Picture !== null &&
      this.auditRecD.after_Picture !== ""
    ) {
      this.url_after = this.url_after + this.auditRecD.after_Picture;
    } else {
      this.url_after = this.urlImage;
    }
    if (
      this.auditRecD.before_Picture !== undefined &&
      this.auditRecD.before_Picture !== null &&
      this.auditRecD.before_Picture !== ""
    ) {
      this.url_before = this.url_before + this.auditRecD.before_Picture;
    } else {
      this.url_before = this.urlImage;
    }
    if (this.auditRecD.mE_PIC !== undefined && this.auditRecD.mE_PIC !== null) {
      this.auditRecD.mE_PIC = this.auditRecD.mE_PIC.trim();
    }
    if (
      this.auditRecD.finished_Date !== undefined &&
      this.auditRecD.finished_Date !== null
    ) {
      this.date = this.auditRecD.finished_Date.trim();
    }

    if (
      this.auditRecD.audit_Item !== undefined &&
      this.auditRecD.audit_Item !== null
    ) {
      this.auditRecD.audit_Item = this.auditRecD.audit_Item.trim();
    }
    if (this.flag == "0") {
      this.auditRecD.status = "Ongoing";
    }
    this.getListRecordID();
    this.getListAuditTypeVersion();
    this.getAllPdPic();
    this.getAllMePic();
  }
  openWebcame(template: TemplateRef<any>,number){
    //before
    if(number ===2)
      this.checkBeforePhoto = false;
    else 
      this.checkBeforePhoto = true;
     //set time out tránh lỗi webcame set with
      setTimeout(() => {
        this.modalRef = this.modalService.show(template);
      }, 100);
   
  }
  btnSave() {
    console.log(this.auditRecD);
    let before =false;
    let after = false;
    if (
      this.auditRecD.status == "Implemented" &&
      (this.auditRecD.finished_Date == "" ||
        this.auditRecD.finished_Date == null ||
        this.auditRecD.finished_Date == undefined)
    ) {
      this.alertifyService.error("Please option finished Date");
    } else {
      if(this.imgBase64Before!="" && this.imgBase64Before !=undefined && this.imgBase64Before !=null)
      {
        this.auditRecD.before_Picture =this.imgBase64Before;
        before =true;
      }
      if(this.imgBase64After !="" && this.imgBase64After !=undefined && this.imgBase64After !=null)
      {
        this.auditRecD.after_Picture = this.imgBase64After;
        after = true;
      }
      // const formData = new FormData();
       this.setAuditRecD();
      
      if (this.flag === "0") {
       console.log(".....>", this.auditRecD);
        this.auditRecDService.createAuditRecD(this.auditRecD).subscribe(
          () => {
            this.alertifyService.success("Add succeed");
            this.router.navigate(["/maintenance/audit-rec"]);
          },
          (error) => {
            this.alertifyService.error(error);
          }
        );
      } else {
        this.auditRecDService.update(this.auditRecD,before,after).subscribe(
          () => {
            this.alertifyService.success("Update succeed");
            this.router.navigate(["/maintenance/audit-rec"]);
          },
          (error) => {
            this.alertifyService.error(error);
          }
        );
      }
    }
  }

  btnSaveAndNext() {
    if (
      this.auditRecD.status == "Implemented" &&
      (this.auditRecD.finished_Date == "" ||
        this.auditRecD.finished_Date == null ||
        this.auditRecD.finished_Date == undefined)
    ) {
      this.alertifyService.error("Please option finished Date");
    } else {
      debugger;
      if(this.imgBase64Before!="" && this.imgBase64Before !=undefined && this.imgBase64Before !=null)
      {
        this.auditRecD.before_Picture =this.imgBase64Before;
      }
      if(this.imgBase64After !="" && this.imgBase64After !=undefined && this.imgBase64After !=null)
      {
        this.auditRecD.after_Picture = this.imgBase64After;
      }
       this.setAuditRecD();
      
       console.log(".....>", this.auditRecD);
        this.auditRecDService.createAuditRecD(this.auditRecD).subscribe(
          () => {
          this.alertifyService.success("Add succeed");
          this.auditRecD = {};
          this.auditRecD.record_ID = "";
          this.auditRecD.pD_PIC = "";
          this.pdDepartment = "";
          this.pdBuilding = "";
          this.auditRecD.mE_PIC = "";
          this.auditRecD.audit_Type_ID = "";
          this.imgBase64Before ="";
          this.imgBase64After ="";
          this.url_after = "";
          this.url_before ="";
          this.auditRecD.status ="Ongoing"
          this.auditRecD.before_Picture ="";
          this.auditRecD.after_Picture ="";
          },
          (error) => {
            this.alertifyService.error(error);
          }
        );
    }
  }

  setAuditRecD() {
    this.auditRecD.pD_Department = this.pdDepartment;
    this.auditRecD.pD_Building = this.pdBuilding;
    if (
      this.auditRecD.finished_Date == undefined ||
      this.auditRecD.finished_Date == ""
    )
    {
      this.auditRecD.finished_Date  =null;
    }
  }
  //hàm lấy file khi upload
  onSelectFile(event, number) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      var file = event.target.files[0];
      reader.onload = (event) => {
        // called once readAsDataURL is completed
      // console.log("file: ", event.target)
        if (number === 1) {
          this.url_before = event.target.result;
          this.imgBase64Before = event.target.result;
        } else {
          this.url_after = event.target.result;
          this.imgBase64After = event.target.result;
        }
      };
    }
  }
  getListAuditTypeVersion() {
    this.auditTypeMService.getAlls().subscribe(
      (data) => {
        this.auditType = data.map((item) => {
          return {
            id: item.audit_Type_ID,
            text: item.audit_Type1 + " - " + item.audit_Type2,
          };
        });
        console.log(this.auditType, data);
      },
      (error) => {
        this.alertifyService.error(error);
      }
    );
  }
  optionAuditType(e) {
    if (
      this.auditRecD.audit_Type_ID != null &&
      this.auditRecD.audit_Type_ID !== ""
    ) {
      this.auditTypeDService
        .searchauditItem(this.auditRecD.audit_Type_ID)
        .subscribe((res) => {
          this.auditItems = res.map((item) => {
            return { id: item, text: item };
          });
        });
    }
  }
  getListRecordID() {
    this.auditRecMService.getListRecordID().subscribe((res) => {
      this.recordIDs = res.map((item) => {
        return { id: item.record_ID, text: item.record_Time };
      });
    });
  }
  getAllPdPic() {
    this.auditPicDService.getAllPdPic().subscribe((res) => {
      this.pdPics = res.map((item) => {
        return { id: item.id, text: item.name };
      });
    });
  }

  getPdDepartment(event: any) {
    this.auditPicDService.getPdDepartment(event).subscribe((res) => {
      this.pdDepartment = res.dataResult;
    });
  }

  getPdBuilding(event: any) {
    this.auditPicDService.getPdBuilding(event).subscribe((res) => {
      this.pdBuilding = res.dataResult;
    });
  }

  getAllPdDepBuil(event: any) {
    //tránh lỗi sever khi event =""
    if (event != "" && event != undefined && event != null) {
      this.getPdDepartment(event);
      this.getPdBuilding(event);
    }
  }

  getAllMePic() {
    this.auditPicDService.getAllMePic().subscribe((res) => {
      this.mePics = res.map((item) => {
        return { id: item.id, text: item.name };
      });
    });
  }
  back() {
    this.router.navigate(["/maintenance/audit-rec"]);
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
  onDateSelect() {
    this.changDate = true;
  }
  cancel() {
    this.auditRecD = {};
    this.auditRecD.record_ID = "";
    this.auditRecD.pD_PIC = "";
    this.pdDepartment = "";
    this.pdBuilding = "";
    this.auditRecD.mE_PIC = "";
    this.auditRecD.audit_Type_ID = "";
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

  public handleImage(webcamImage1: WebcamImage): void {

    this.webcamImage = webcamImage1;
    if(this.checkBeforePhoto)
    {
      this.url_before = webcamImage1.imageAsDataUrl;
      this.imgBase64Before = webcamImage1.imageAsBase64;
    }
    else
    {
      this.url_after = webcamImage1.imageAsDataUrl;
          this.imgBase64After = webcamImage1.imageAsBase64
    } 
    console.info("received webcam image", webcamImage1);
    this.modalRef.hide();
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
