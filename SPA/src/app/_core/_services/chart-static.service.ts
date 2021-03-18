import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Factory } from '../_models/chart-factory-tree';
import { SMEStaticChart } from '../_models/sme-chart-static';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartStaticService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getDataFactoryTree() {
    return this.http.get<Factory>(this.baseUrl + 'SMEStaticChart');
  }

  getDataChart(id, type) {
    return this.http.get<SMEStaticChart>(this.baseUrl + 'SMEStaticChart/data-chart', {
      params: {
        id: id,
        type: type
      }
    })
  }
}
