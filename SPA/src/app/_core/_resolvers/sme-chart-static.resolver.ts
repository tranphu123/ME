
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SMEStaticChart } from '../_models/sme-chart-static';
import { ChartStaticService } from '../_services/chart-static.service';

@Injectable({ providedIn: 'root' })
export class SMEStaticChartResolve implements Resolve<SMEStaticChart> {
    constructor( private chartStaticService: ChartStaticService) { }
    resolve(route: ActivatedRouteSnapshot,): Observable<SMEStaticChart>| Promise<SMEStaticChart> | SMEStaticChart  {
        const id = route.paramMap.get("id");
        const type = route.paramMap.get("type");
        return this.chartStaticService.getDataChart(id,type);
    }
}
