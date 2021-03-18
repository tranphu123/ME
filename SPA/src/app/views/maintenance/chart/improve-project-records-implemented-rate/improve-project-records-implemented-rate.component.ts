import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ImproveProject } from '../../../../_core/_models/improve-project';
import { ImproveProjectService } from '../../../../_core/_services/improve-project.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-improve-project-records-implemented-rate',
  templateUrl: './improve-project-records-implemented-rate.component.html',
  styleUrls: ['./improve-project-records-implemented-rate.component.scss']
})
export class ImproveProjectRecordsImplementedRateComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    plugins: {
      datalabels: {
        color: 'black',
        formatter: (value, ctx) => {
          let sum = 0;
          const dataArr = (ctx.chart.data.datasets[0].data);
          const label = (ctx.chart.data.labels[ctx.dataIndex]);
          dataArr.forEach(data => {
            sum += data;
          });
          const percentage = label + '\n' + (value * 100 / sum).toFixed(2) + '%';
          return percentage;
        },
        font: {
          weight: 'bold',
          size: 16,
        },
      },
    },

  };
  public chartPlugins = [pluginDataLabels];
  public chartLabels: string[] = ['Implemented', 'Ongoing', 'Not Feasible'];
  public chartLegend = true;
  public chartType = 'pie';
  public babackgroundColor =[];

  public chartData: ChartDataSets[] = [{
    data: [],
    backgroundColor:this.babackgroundColor,
  }];

  data: ImproveProject[] = [];
  sumData: number = 0;

  constructor(private improveProjectService: ImproveProjectService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinnerService.show();
    this.improveProjectService.getDataChartImproveProjectRecordsImplementedRateThisMonth()
      .subscribe(res => {
        console.log("Chart", res)
        this.data = res;
        this.chartData[0].data = res.map(item => {
          return item.qty;
        });
        this.sumData = this.data.reduce((sum, item) => {
          return sum += item.qty;
        }, 0);
        this.chartLabels = res.map(item => {
          return item.status;
        });
        res.map(item=>{
          if(item.status.trim() =="Implemented")
          {
            this.babackgroundColor.push("green");
          }
          if(item.status.trim() =="Ongoing")
          {
            this.babackgroundColor.push("yellow");
          }
          if(item.status.trim() =="Not Feasible")
          {
            this.babackgroundColor.push("red");
          }
        });
        this.spinnerService.hide();
      });
  }

}
