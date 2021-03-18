import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sme-static-chart',
  templateUrl: './sme-static-chart.component.html',
  styleUrls: ['./sme-static-chart.component.scss']
})
export class SmeStaticChartComponent implements OnInit {
  highcharts = Highcharts;
  chartOptionsModule1: any;
  chartOptionsModule3: any;
  tableWeakness:any;
  nodata :boolean = false;
  title:string="";
  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe(res => {
      var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.",
     "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
      let today = new Date();
      if(today.getMonth() ==0)
      {
        res.data.month = months[11].toString();
      }
      else
      {
        res.data.month= months[today.getMonth()-1].toString();
      }
      // res.data.month = months[today.getMonth()-1].toString();
      this.chartOptionsModule1 = new ChartData(res.data.chartModule1, res.data.listLables,  res.data.month + " " + "Module 1 audit result");
      this.chartOptionsModule3 = new ChartData(res.data.chartModule3, res.data.listLables,  res.data.month + " " + "Module 3 audit result");
      this.tableWeakness = res.data.resultTest;
      this.title = res.data.title;
      
      if(this.tableWeakness.length ===0)
      {
        this.nodata = true;
      }
    });
    
  }
}

class ChartData {
  chart: any = {
    type: "bar",
    events: {
      load: function () {
        Highcharts.each(this.series[0].points, function (p) {
          if (p.y > 80) {
            p.update({
              color: "green"
            });
          } else {
            p.update({
              color: "red"
            });
          }
        });
      }
    }
  };
  title: any = {
    text: ""
  };
  xAxis: any = {
    categories: [],
    labels: {
      style: {
        fontSize: "15px",
        fontWeight: "bold"
      }
    }
  };
  yAxis: any = {
    stackLabels: {
      enabled: true,
      format: "{total}%",
      style: {
        fontSize: "14px"
      }
    },
    allowDecimals: false,
    min: 0,
    title: {
      enabled: false
    },
    labels: {
      format: "{value}%",
      style: {
        fontSize: "13px",
        fontWeight: "bold"
      }
    }
  };
  plotOptions: any = {
    series: {
      stacking: "normal"
    }
  };
  credits: any = {
    enabled: false
  };
  series: any = [];

  constructor(dataParms: any, lables: string[], title: string) {
    var chartData = {
      data: dataParms,
      showInLegend: false,
    }
    this.series.push(chartData);
    this.xAxis.categories = lables;
    this.title.text = title
  }
}
