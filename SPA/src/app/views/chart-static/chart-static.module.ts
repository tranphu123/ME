import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FactoryTreeComponent } from './factory-tree/factory-tree.component';
import { SmeStaticChartComponent } from './sme-static-chart/sme-static-chart.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartStaticRoutingModule } from './chart-static.routing.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsModule } from 'ng2-charts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        PaginationModule,
        NgSelectModule,
        ChartStaticRoutingModule,
        HighchartsChartModule,
        ChartsModule,
        TooltipModule.forRoot()
      
    ],
    declarations: [
        FactoryTreeComponent,
        SmeStaticChartComponent,
        
    ],
    exports:[FactoryTreeComponent],
    bootstrap:[FactoryTreeComponent],
    schemas: [
        NO_ERRORS_SCHEMA
      ]
})
export class ChartStaticModule{}