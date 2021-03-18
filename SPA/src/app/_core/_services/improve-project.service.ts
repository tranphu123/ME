import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ImproveProject } from '../_models/improve-project';
import { FunctionUtility } from '../_utility/function-utility';
import { KpiTracking } from '../_models/kpi-tracking';
@Injectable({
    providedIn: 'root'
})
export class ImproveProjectService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient,
        private functionUtility: FunctionUtility) { }

    getDataChartImproveProjectRecordsImplementedRateThisMonth() {
        return this.http.get<ImproveProject[]>(this.baseUrl
            + 'ImproveProject/ImproveProjectRecordsImplementedRateThisMonth');
    }

    getDataChartImproveProjectRecordsImplementedRateLastMonth() {
        return this.http.get<ImproveProject[]>(this.baseUrl
            + 'ImproveProject/ImproveProjectRecordsImplementedRateLastMonth');
    }

    getDataChartKpiTracking(timeFrom: Date, timeEnd: Date, line: string, styleNo: string) {
        const t1 = timeFrom == null ? '' : this.functionUtility.getDateFormat(timeFrom);
        const t2 = timeEnd == null ? '' :  this.functionUtility.getDateFormat(timeEnd);
        return this.http.get<KpiTracking[]>(this.baseUrl
            + 'ImproveProject/GetDataKpiTrackingChart?timeFrom=' + t1 + '&timeEnd=' + t2 + '&line=' + line + '&styleNo=' + styleNo);
    }

    getListLine() {
        return this.http.get<any>(this.baseUrl + 'ImproveProject/GetListLine');
    }

    getListStyleNo() {
        return this.http.get<string[]>(this.baseUrl + 'ImproveProject/GetListStyleNo');
    }
}
