// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelect2Module } from 'ng-select2';
import { HighchartsChartModule } from 'highcharts-angular';
//Components Routing
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ChartRoutingModule } from './chart-routing.module';
import { MovieQueryManagementComponent } from './movie-query-management/movie-query-management.component';
import { ChartMonthlyComponent } from './chart-monthly/chart-monthly.component';
import { ImproveProjectRecordsImplementedRateComponent } from './improve-project-records-implemented-rate/improve-project-records-implemented-rate.component';
import { ChartsModule } from 'ng2-charts';
import { KpiStrackingComponent } from './kpi-stracking/kpi-stracking.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ChartRoutingModule,
    PaginationModule,
    NgSelectModule,
    HighchartsChartModule,
    BsDropdownModule,
    NgSelect2Module,
    BsDatepickerModule.forRoot(),
    ChartsModule
  ],
  declarations: [
    MovieQueryManagementComponent,
    ChartMonthlyComponent,
    ImproveProjectRecordsImplementedRateComponent,
    KpiStrackingComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})

export class chartModule {
}
