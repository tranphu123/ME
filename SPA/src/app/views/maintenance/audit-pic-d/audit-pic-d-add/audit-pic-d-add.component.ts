import { Component, OnInit } from "@angular/core";
import { AuditPicDService } from "../../../../_core/_services/audit-pic-d.service";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { Router } from "@angular/router";
import { AuditPicMService } from "../../../../_core/_services/audit-pic-m.service";
import { Select2OptionData } from 'ng-select2';
import { MesOrgService } from '../../../../_core/_services/mes-org.service';

@Component({
  selector: "app-audit-pic-d-add",
  templateUrl: "./audit-pic-d-add.component.html",
  styleUrls: ["./audit-pic-d-add.component.scss"]
})
export class AuditPicDAddComponent implements OnInit {
  auditPicD: any = {};
  auditPicM: Array<Select2OptionData>;
  flag = "0";
  lang: string = "EN";
  update: boolean = true;
  pdcs: Array<Select2OptionData>;
  buildings: Array<Select2OptionData>;
  lines: Array<Select2OptionData>;
  constructor(
    private auditPicDService: AuditPicDService,
    private auditPicMService: AuditPicMService,
    private alertify: AlertifyService,
    private router: Router,
    private mesOrgService: MesOrgService
  ) { }

  ngOnInit(): void {
    this.auditPicDService.currentFlag.subscribe(flag => (this.flag = flag));
    this.auditPicDService.currentAuditPicD.subscribe(auditPicD => {
      this.auditPicD = auditPicD;
      if (this.flag == "1") {
        this.lang = this.auditPicD.language;
      }
    });
    this.getAllPicM();
    this.getAllPdc();
  }
  getAllPicM() {
    this.auditPicMService.getAlls().subscribe(res => {
      this.auditPicM = res.map(item => {
        return { id: item.piC_Type_ID, text: item.piC_Type_ZW };
      });
    });
  }
  cancel() {
    this.auditPicD = {};
  }
  backList() {
    this.router.navigate(["/maintenance/audit-pic-d"]);
  }

  saveAndNext() {
    this.auditPicD.language = this.lang;
    if (this.flag === "0") {
      this.auditPicDService.create(this.auditPicD).subscribe(
        () => {
          this.alertify.success("Add succeed");
          this.auditPicD = {};
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }

  save() {
    this.auditPicD.language = this.lang;
    if (this.flag === "0") {
      console.log(this.auditPicD);
      this.auditPicDService.create(this.auditPicD).subscribe(
        () => {
          this.alertify.success("Add succeed");
          this.router.navigate(["/maintenance/audit-pic-d"]);
        },
        error => {
          this.alertify.error(error);
        }
      );
    } else {
      this.auditPicDService.update(this.auditPicD).subscribe(
        () => {
          this.alertify.success("Updated succeed");
          this.router.navigate(["/maintenance/audit-pic-d"]);
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }

  deleteListItem(selectorID) {
    // tslint:disable-next-line:prefer-const
    let el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
  }
  changeHtmlError(parentDiv, span, newHtml) {
    if (document.getElementById(span) === null) {
      document
        .querySelector(parentDiv)
        .insertAdjacentHTML("beforeend", newHtml);
    } else {
      this.deleteListItem(span);
      document
        .querySelector(parentDiv)
        .insertAdjacentHTML("beforeend", newHtml);
    }
  }
  changeLanguage(event) {
    this.lang = event;
  }

  getAllPdc() {
    this.mesOrgService.getAllPdc().subscribe(res => {
      this.pdcs = res.map(item => {
        return { id: item.id, text: item.name };
      });
    });
  }

  getAllBuilding() {
    this.mesOrgService.getAllBuilding(this.auditPicD.pdc).subscribe(res => {
      this.buildings = res.map(item => {
        return { id: item.id, text: item.name };
      });
    });
  }

  getAllLine() {
    this.mesOrgService.getAllLineId(this.auditPicD.pdc, this.auditPicD.building).subscribe(res => {
      this.lines = res.map(item => {
        return { id: item.id, text: item.name };
      });
    });
  }

  pdcChange() {
    this.getAllBuilding();
  }
  buingdingChange() {
    this.getAllLine();
  }

  /////////////////
  check() {
    const countCharactersPdc = this.auditPicD["pdc"].split("").length;
    const countCharactersBuilding = this.auditPicD["building"].split("").length;
    const countCharactersLanguage = this.auditPicD["language"].split("").length;
    const countCharactersLine = this.auditPicD["line"].split("").length;
    const parrentPdc = ".parent-pdc";
    const parrentBuilding = ".parent-building";
    const parrentLanguage = ".parent-language";
    const parrentLine = ".parent-line";
    const spanPdc = "pdc-id";
    const spanBuilding = "building-id";
    const spanLanguage = "language-id";
    const spanLine = "line-id";
    const newHtmlPdc =
      '<span id="pdc-id" style="color:red;">Maximum 1 characters</span>';
    const newHtmlBuilding =
      '<span id="building-id" style="color:red;">Maximum 1 characters</span>';
    const newHtmlLanguage =
      '<span id="language-id" style="color:red;">Maximum 2 characters</span>';
    const newHtmlLine =
      '<span id="line-id" style="color:red;">Maximum 3 characters</span>';
    if (countCharactersPdc > 1) {
      this.changeHtmlError(parrentPdc, spanPdc, newHtmlPdc);
    } else {
      if (document.getElementById(spanPdc) !== null) {
        this.deleteListItem(spanPdc);
      }
    }
    if (countCharactersLine > 3) {
      this.changeHtmlError(parrentLine, spanLine, newHtmlLine);
    } else {
      if (document.getElementById(spanLine) !== null) {
        this.deleteListItem(spanLine);
      }
    }

    if (countCharactersBuilding > 1) {
      this.changeHtmlError(parrentBuilding, spanBuilding, newHtmlBuilding);
    } else {
      if (document.getElementById(spanBuilding) !== null) {
        this.deleteListItem(spanBuilding);
      }
    }

    if (countCharactersLanguage > 2) {
      this.changeHtmlError(parrentLanguage, spanLanguage, newHtmlLanguage);
    } else {
      if (document.getElementById(spanLanguage) !== null) {
        this.deleteListItem(spanLanguage);
      }
    }

    if (
      countCharactersPdc === 1 &&
      countCharactersBuilding === 1 &&
      countCharactersLine <= 3 &&
      countCharactersLine >= 1 &&
      countCharactersLanguage <= 2 &&
      countCharactersLanguage >= 1
    ) {
      let error = 0;
    }
  }
}
