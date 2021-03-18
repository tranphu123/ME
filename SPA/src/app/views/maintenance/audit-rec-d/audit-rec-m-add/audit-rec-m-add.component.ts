import { Component, OnInit } from "@angular/core";
import { MesOrgService } from "../../../../_core/_services/mes-org.service";
import { MesMoService } from "../../../../_core/_services/mes-mo.service";
import { AuditRecMService } from "../../../../_core/_services/audit-rec-m.service";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { Router } from "@angular/router";
import { FunctionUtility } from '../../../../_core/_utility/function-utility';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: "app-audit-rec-m-add",
  templateUrl: "./audit-rec-m-add.component.html",
  styleUrls: ["./audit-rec-m-add.component.scss"],
})
export class AuditRecMAddComponent implements OnInit {
  auditRecM: any = {};
  flag: string;
  iswt: string = "isWT";
  pdcs: Array<Select2OptionData>;
  buildings: Array<Select2OptionData>;
  lineIDs: Array<Select2OptionData>;
  modelNos: Array<Select2OptionData>;
  today: Date = new Date();
  constructor(
    private mesOrgService: MesOrgService,
    private mesMoService: MesMoService,
    private auditRecMService: AuditRecMService,
    private alertifyService: AlertifyService,
    private router: Router,
    private functionUtility: FunctionUtility
  ) { }
  ngOnInit() {
    this.getAllPdc();
    this.getAllModelNo();
    this.pdcChange();
    this.buingdingChange();

    this.auditRecMService.auditRecMSource.subscribe(auditRecM => this.auditRecM = auditRecM);
    this.auditRecMService.flagSource.subscribe(flag => this.flag = flag);
  }
  saveAndNext() {
    const auditRecM: any = {
      record_Time: this.functionUtility.getDateFormat(this.auditRecM.record_Time),
      pdc: this.auditRecM.pdc,
      building: this.auditRecM.building,
      line: this.auditRecM.line,
      model_No: this.auditRecM.model_No,
      model_Name: this.auditRecM.model_Name,
      chief: this.auditRecM.chief,
      recorder: this.auditRecM.recorder,
      attendees: this.auditRecM.attendees,
    }
    this.auditRecMService.create(auditRecM).subscribe(
      (res) => {
        this.alertifyService.success("Add succed!");
        this.auditRecM = {};
        this.auditRecM.pdc = '';
        this.auditRecM.building = '';
        this.auditRecM.line = '';
        this.auditRecM.model_No = '';
      },
      (error) => {
        this.alertifyService.error(error);
      }
    );
  }
  save() {
    if (this.flag == '0') {
      const auditRecM: any = {
        record_Time: this.functionUtility.getDateFormat(this.auditRecM.record_Time),
        pdc: this.auditRecM.pdc,
        building: this.auditRecM.building,
        line: this.auditRecM.line,
        model_No: this.auditRecM.model_No,
        model_Name: this.auditRecM.model_Name,
        chief: this.auditRecM.chief,
        recorder: this.auditRecM.recorder,
        attendees: this.auditRecM.attendees,
      }
      this.auditRecMService.create(auditRecM).subscribe(
        (res) => {

          this.alertifyService.success("Add succed!");
          this.router.navigate(["/maintenance/audit-rec"]);
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
    }
    else {
      console.log(this.today);
      this.auditRecMService.update(this.auditRecM).subscribe(
        (res) => {
          this.alertifyService.success("Update succed!");
          this.router.navigate(["/maintenance/audit-rec"]);
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
    }

  }
  cancel() {
    this.auditRecM = {};
    this.auditRecM.pdc = '';
    this.auditRecM.building = '';
    this.auditRecM.line = '';
    this.auditRecM.model_No = '';
  }
  getAllPdc() {
    this.mesOrgService.getAllPdc().subscribe((res) => {
      this.pdcs = res.map(item => {
        return {id: item.id, text: item.name};
      });
    });

    
  }
  getAllBuilding() {
    this.mesOrgService.getAllBuilding(this.auditRecM.pdc).subscribe((res) => {
      this.buildings = res.map(item => {
        return {id: item.id, text: item.name};
      });
      this.getAllLineId();
    });

  }
  getAllLineId() {
    this.mesOrgService
      .getAllLineIdAuditOrg(this.auditRecM.pdc, this.auditRecM.building, this.iswt)
      .subscribe((res) => {
        this.lineIDs = res.map(item => { 
          return {id: item.id, text: item.name};
        });
      });

  }
  getAllModelNo() {
    this.mesMoService.getModelNo().subscribe((res) => {
      this.modelNos = res.map(item => {
        return {id: item, text: item};
      });
    });
  }
  changeOptionModelNo() {
    if (this.auditRecM.model_No != null) {
      this.mesMoService.getModelName(this.auditRecM.model_No).subscribe((res) => {
        this.auditRecM.model_Name = res.dataResult;
      });
    }
  }
  pdcChange() {
    this.getAllBuilding();
  }
  buingdingChange() {
    this.getAllLineId();
  }
  back() {
    this.router.navigate(["/maintenance/audit-rec"]);
  }
  changedate( event: Date)
  {
    this.auditRecM.record_Time= this.functionUtility.returnDayNotTime(event);
  }
}
