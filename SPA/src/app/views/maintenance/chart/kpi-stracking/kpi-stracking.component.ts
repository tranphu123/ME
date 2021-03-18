import { Component, OnInit } from '@angular/core';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Select2OptionData } from 'ng-select2';
import { Color, Label } from 'ng2-charts';
import { ImproveProjectService } from '../../../../_core/_services/improve-project.service';
import { KpiTracking } from '../../../../_core/_models/kpi-tracking';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-kpi-stracking',
  templateUrl: './kpi-stracking.component.html',
  styleUrls: ['./kpi-stracking.component.scss']
})
export class KpiStrackingComponent implements OnInit {
  public chartData: ChartDataSets[] = [
    { 
      // data: [65, 59, 80, 81, 56, 55, 40], 
      data: [], 
      fill: false, lineTension: 0, 
      pointBorderWidth: 5,
      pointBorderColor: 'red',
      pointStyle: 'rectRot',
      datalabels: {display: false},
      label: 'EOLR Target' 
    },
    { 
      // data: [28, 48, 40, 19, 86, 27, 90], 
      data: [], 
      fill: false, lineTension: 0, 
      pointBorderWidth: 5,
      pointBorderColor: 'blue',
      pointStyle: 'circle',
      datalabels: {display: false},
      label: 'Real EOLR' 
    },
    { 
      // data: [1.76, 1.76, 1.76, 1.76, 1.76, 1.76, 1.76], 
      data: [], 
      fill: false, lineTension: 0,
      borderColor: 'green',
      pointBorderWidth: 5,
      pointBorderColor: 'green',
      pointStyle: 'triangle',
      datalabels: {display: false}, 
      label: 'PPH Target', 
      yAxisID: 'y-axis-1' 
    },
    {
      // data: [1.67, 1.56, 1.67, 1.61, 1.71, 1.66, 1.72], 
      data: [], 
      fill: false, lineTension: 0,
      borderColor: 'purple',
      pointBorderWidth: 5,
      pointBorderColor: 'purple',
      pointStyle: 'rectRounded',
      datalabels: {display: false}, 
      label: 'Real PPH', 
      yAxisID: 'y-axis-1' 
    }
  ];
  public chartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public chartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            beginAtZero: true
          }
        },
        {
          id: 'y-axis-1',
          position: 'right',
          ticks: {
            beginAtZero: true
          },
          // gridLines: {
          //   color: 'rgba(255,0,0,0.3)',
          // },
          // ticks: {
          //   fontColor: 'red',
          // }
        }
      ]
    },
    legend: {
      position: 'bottom'
    }
  };
  public chartColors: Color[] = [
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // },
    // { // dark grey
    //   backgroundColor: 'rgba(77,83,96,0.2)',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    // { // red
    //   backgroundColor: 'rgba(255,0,0,0.3)',
    //   borderColor: 'red',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // }
  ];
  public chartLegend = true;
  public chartType: ChartType = 'line';
  // public chartPlugins = [pluginDataLabels];

  // timeFrom: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1) = null;
  timeFrom: Date = null;
  // timeEnd: Date = new Date() = null;
  timeEnd: Date = null;
  lines: Array<Select2OptionData> = [];
  line: string = '';
  styleNos: Array<Select2OptionData> = [];
  styleNo: string = '';
  data: KpiTracking[] = [];

  constructor(private improveProjectService: ImproveProjectService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.getListLine();
    this.getListStyleNo();
  }

  getListLine() {
    this.spinnerService.show();
    this.improveProjectService.getListLine().subscribe(res => {
      console.log(res);
      this.lines = res.map(item => {
        return { id: item.dept_ID.toString(), text: item.dept_Name.toString() };
      });
      this.spinnerService.hide();
    });
  }

  getListStyleNo() {
    this.improveProjectService.getListStyleNo().subscribe(res => {
      this.styleNos = res.map(item => {
        return { id: item, text: item };
      });
    });
  }

  getData() {
    if (this.line === '' || this.styleNo === '') {
      this.alertifyService.error('Please choose Line and Style No');
      return;
    }
    this.spinnerService.show();
    this.improveProjectService.getDataChartKpiTracking(this.timeFrom, this.timeEnd, this.line, this.styleNo).subscribe(res => {
      this.data = res;
      this.chartLabels = res.map(item => {
        return item.yield_Date.toString().substring(0, 10);
      });
      this.chartData[0].data = res.map(item => {
        return item.eolR_Target;
      });
      this.chartData[1].data = res.map(item => {
        return item.eolr;
      });
      this.chartData[2].data = res.map(item => {
        return item.ppH_Target;
      });
      this.chartData[3].data = res.map(item => {
        return item.pph;
      });
      this.spinnerService.hide();
    });
  }

  search() {
    this.getData();
  }

}
