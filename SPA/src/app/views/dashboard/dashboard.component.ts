import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import { ChartMonthlyService } from '../../_core/_services/chart-monthly.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ImproveProjectService } from '../../_core/_services/improve-project.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  monthPrevious: string;
  highcharts = Highcharts;
  chartOptions: any;
  dataChart: any;
  titleX: string[];
  columnName: string[];

  public chartPieOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom'
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
  public chartPiePlugins = [pluginDataLabels];
  public chartPieLabels: string[] = ['Implemented', 'Ongoing', 'Not Feasible'];
  public chartPieLegend = true;
  public chartPieType = 'pie';
  public babackgroundColor =[];

  public chartPieData: ChartDataSets[] = [{
    data: [],
    backgroundColor:this.babackgroundColor,
  }];

  constructor(private chartService: ChartMonthlyService,
    private improveProjectService: ImproveProjectService) {}

  ngOnInit() : void {
    var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.",
     "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    let today = new Date();
    if(today.getMonth() ==0)
    {
      this.monthPrevious = months[11].toString();
    }
    else
    {
      this.monthPrevious = months[today.getMonth()-1].toString();
    }
   
    this.getDataChart();
    this.getDataChartPie();
  }
  getDataChart() {
    this.chartService.getChartByMonthlyPrevious().subscribe((res) => {
      this.dataChart = res.dataChart;
      this.titleX = res.titleX;
      this.columnName = res.columnName;
      console.log(this.dataChart);
      this.chartOptions = {
        chart: {
          type: "column",
        },
        title: {
          text:  this.monthPrevious + " Walkthrough Chart",
        },
        xAxis: {
          categories: this.titleX,
        },
        zAxis: {
          categories: ["a","b"],
        },
        yAxis: {
          allowDecimals: true,
          min: 0,
          title: {
            text: "Number of fruits",
          },
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
            },
          },
        },
        credits: {
          enabled: false,
        },
        series: this.dataChart
      };
    });
  }

  getDataChartPie() {
    this.improveProjectService.getDataChartImproveProjectRecordsImplementedRateLastMonth()
      .subscribe(res => {
        this.chartPieData[0].data = res.map(item => {
          return item.qty;
        });
        this.chartPieLabels = res.map(item => {
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
      });
  }
}
