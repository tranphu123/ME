import { INavData } from "@coreui/angular";
import { Injectable } from "@angular/core";

export const navItems: INavData[] = [];
@Injectable({
  providedIn: "root" // <- ADD THIS
})
export class NavItem {
  navItems: INavData[] = [];
  hasReport: boolean = false;
  hasUser: boolean = false;
  constructor() {}

  getNav() {
    this.navItems = [];
    this.hasUser= false;
    this.hasReport = false;
    const navItemReport = {
      name: "Report",
      url: "/report/",
      icon: "icon-chart",
      class: "menu-margin",
      children: []
    };

    const navItemSetting = {
      name: "Setting",
      url: "/setting/",
      icon: "icon-settings",
      class: "menu-margin",
      children: []
    };  

    const user: any = JSON.parse(localStorage.getItem("user"));
    console.log("user",user);
    user.role.forEach(element => {
      if (element === "MesAudit.Brand") {
        const navItem = {
          name: "Brand",
          url: "/maintenance/brand",
          icon: "icon-bell"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.AuditType") {
        const navItem = {
          name: "Audit Type",
          url: "/maintenance/audit-type",
          icon: "icon-list"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.AuditTypeD") {
        const navItem = {
          name: "Audit Type D",
          url: "/maintenance/audit-type-d",
          icon: "icon-briefcase"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.DeptSetting") { 
        const navItem = {
          name: "Dept Setting",
          url: "/maintenance/audit-pic-m",
          icon: "icon-grid"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.DeptMemberSetting") {
        const navItem = {
          name: " Dept Member Setting",
          url: "/maintenance/audit-pic-d",
          icon: "icon-eyeglass"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.WTTrackingList") {
        const navItem = {
          name: "WT Tracking List",
          url: "/maintenance/audit-rec",
          icon: "icon-eyeglass"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.SMEScoreRecord") {
        const navItem = {
          name: "SME Score Record",
          url: "/maintenance/sme-score-record",
          icon: "icon-note"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.6SScoreRecord") {
        const navItem = {
          name: "6S Score Record",
          url: "/maintenance/6s-score-record",
          icon: "icon-note"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.WaterSpiderScoreRecord") {
        const navItem = {
          name: "Water Spider Score Record",
          url: "/maintenance/water-spider-score-record",
          icon: "icon-note"
        };
        this.navItems.push(navItem);
      }
      if (element === "MesAudit.WTTrackingList.Report") {
        const children = {
          name: "WT Tracking List Report",
          url: "/maintenance/report/audit-rec-report",
          class: "menu-margin"
        };
        this.hasReport = true;
        navItemReport.children.push(children);
      }
      if (element === "MesAudit.SMEScoreRecord.Report") {
        const children = {
          name: "SME Score Record Report",
          url: "/maintenance/report/sme-score-report",
          class: "menu-margin"
        };
        this.hasReport = true;
        navItemReport.children.push(children);
      }
      if (element === "MesAudit.6SScoreRecord.Report") {
        const children = {
          name: "6S Score Record Report",
          url: "/maintenance/report/6s-score-report",
          class: "menu-margin"
        };
        this.hasReport = true;
        navItemReport.children.push(children);
      }
      if (element === "MesAudit.WaterSpiderScoreRecord.Report") {
        const children = {
          name: "Water Spider Score Record Report",
          url: "/maintenance/report/water-spider-score-report",
          class: "menu-margin"
        };
        this.hasReport = true;
        navItemReport.children.push(children);
      }
      if (element === "MesAudit.UserManagement") {
        const children = {
          name: "User",
          url: "/maintenance/setting/user",
          class: "menu-margin"
        };
        this.hasUser = true;
        navItemSetting.children.push(children);
      }
      if (element === "MesAudit.ShowLineSetting") {
        const children = {
          name: "Show Line",
          url: "/maintenance/setting/show-line",
          class: "menu-margin"
        };
        this.hasUser = true;
        navItemSetting.children.push(children);
      }
    });
    //kiểm tra xem có report không
    if (this.hasReport ) {
      this.navItems.push(navItemReport);
    }
    if(this.hasUser)
    {
      this.navItems.push(navItemSetting);
    }

    const navItem = {
      name: "Chart",
      icon: "icon-chart",
      children: [
        {
          name: "Movie Query Management ",
          url: "/maintenance/chart/movie-query-management",
          class: "menu-margin"
        },
        {
          name: "SME Score record Statistic",
          url: "/chart-static/factory-tree",
          class: "menu-margin"
        },
        {
          name: "Walkthrough Kaizen Chart",
          url: "/maintenance/chart/chart-by-monthly",
          class: "menu-margin"
        },
        {
          name: "KPIs Tracking-EOLR&PPH",
          url: "/maintenance/chart/kpi-stracking",
          class: "menu-margin"
        },
        {
          name: "KAIZEN Roll Out Rate",
          url: "/maintenance/chart/improve-project-records-implemented-rate",
          class: "menu-margin"
        }
      ]
    };
    this.navItems.push(navItem);
    return this.navItems;
  }
}
