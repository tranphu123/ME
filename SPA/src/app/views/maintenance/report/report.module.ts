// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelect2Module } from 'ng-select2';
//Components Routing
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReportRoutingModule } from './report-routing.module';
import { SixsScoreReportComponent } from './6s-score-report/6s-score-report.component';
import { AuditRecDReportComponent } from './audit-rec-d/audit-rec-d.component';
import { WaterSpiderScoreReportComponent } from './water-spider-score-report/water-spider-score-report.component';
import { SmeScoreReportComponent } from './sme-score-report/sme-score-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ReportRoutingModule,
    PaginationModule,
    NgSelectModule,
    BsDropdownModule,
    NgSelect2Module,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    SmeScoreReportComponent,
    AuditRecDReportComponent,
    SixsScoreReportComponent,
    WaterSpiderScoreReportComponent
  ],
})

export class ReportModule {
}
