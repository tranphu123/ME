import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ChartMonthlyComponent } from './chart-monthly/chart-monthly.component';
import { MovieQueryManagementComponent } from './movie-query-management/movie-query-management.component';
import { ImproveProjectRecordsImplementedRateComponent } from './improve-project-records-implemented-rate/improve-project-records-implemented-rate.component';
import { KpiStrackingComponent } from './kpi-stracking/kpi-stracking.component';
const routes: Routes = [
  {
    path: "",
    data: {
      title: "chart",
    },
    children: [
      {
        path: "movie-query-management",
        component: MovieQueryManagementComponent,
        data: {
          title: "movie-query-management",
        },
      },
      {
        path: "chart-by-monthly",
        component: ChartMonthlyComponent,
        data: {
          title: "Walkthrough Kaizen Chart",
        },
      },
      {
        path: 'improve-project-records-implemented-rate',
        component: ImproveProjectRecordsImplementedRateComponent,
        data: {
          title: 'KAIZEN Roll Out Rate'
        }
      },
      {
        path: 'kpi-stracking',
        component: KpiStrackingComponent,
        data: {
          title: 'KPIs Tracking-EOLR&PPH'
        }
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartRoutingModule {}
