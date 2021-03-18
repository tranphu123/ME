import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { FactoryTreeComponent } from './factory-tree/factory-tree.component';
import { SmeStaticChartComponent } from './sme-static-chart/sme-static-chart.component';
import { SMEStaticChartResolve } from '../../_core/_resolvers/sme-chart-static.resolver';

const routes: Routes = [
    {
        path: '',
        component: FactoryTreeComponent
    },
    {
        path: ':type/:id',
        component: SmeStaticChartComponent,
        resolve:{
            data :SMEStaticChartResolve
        }
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ChartStaticRoutingModule { }