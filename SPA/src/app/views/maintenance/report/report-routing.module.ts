import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmeScoreReportComponent } from './sme-score-report/sme-score-report.component';
import { AuditRecDReportComponent } from './audit-rec-d/audit-rec-d.component';
import { SixsScoreReportComponent } from './6s-score-report/6s-score-report.component';
import { WaterSpiderScoreReportComponent } from './water-spider-score-report/water-spider-score-report.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'report'
    },
    children: [
      {
        path: 'audit-rec-report',

              component: AuditRecDReportComponent,
              data: {
                title: 'WT Tracking List Report'
              }
      },
      {
        path: 'sme-score-report',

              component: SmeScoreReportComponent,
              data: {
                title: 'SME Score Report'
              }
      },
      {
        path: '6s-score-report',

              component: SixsScoreReportComponent,
              data: {
                title: '6S Score Report'
              }
      },
      {
        path: 'water-spider-score-report',

              component: WaterSpiderScoreReportComponent,
              data: {
                title: 'Water Spider Score Report'
              }
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
