import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import { ChartMonthlyService } from "../../../../_core/_services/chart-monthly.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MesMoService } from '../../../../_core/_services/mes-mo.service';
import { Select2OptionData } from 'ng-select2';
import { AuditRecMService } from '../../../../_core/_services/audit-rec-m.service';
import { FunctionUtility } from '../../../../_core/_utility/function-utility';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chart-monthly',
  templateUrl: './chart-monthly.component.html',
  styleUrls: ['./chart-monthly.component.css']
})
export class ChartMonthlyComponent implements OnInit {

  highcharts = Highcharts;
  chartOptions: any;
  dataChart: any;
  titleX: string[];
  columnName: string[];
  disable = false;
  bsConfig: Partial<BsDatepickerConfig>;
  public modelNoList: Array<Select2OptionData>;
  public lineList: Array<Select2OptionData>;
  public typeList: Array<Select2OptionData>;
  optionsSelectModelNo = {
    placeholder: "Select Model No...",
    allowClear: true,
    width: "100%"
  };
  optionsSelectLine = {
    placeholder: "Select Line...",
    allowClear: true,
    width: "100%"
  };
  optionsSelectType = {
    placeholder: "Select Type...",
    allowClear: true,
    width: "100%"
  };
  time_start: string;
  time_end: string;
  model_no: string = "";
  model_name: string = "";
  line: string = "";
  status: string = "";
  type: string = "";
  constructor(private chartService: ChartMonthlyService,
    private spinner: NgxSpinnerService,
    private mesMoService: MesMoService,
    private alertify: AlertifyService,
    private auditRecService: AuditRecMService,
    private functionUtility: FunctionUtility) {}
  ngOnInit(): void {
    this.setTimeByMonthly();
    this.getAllModelNo();
    this.getAllLine();
    this.getAllType();
  }
  setTimeByMonthly() {
    // Khoảng thời gian để mặc định là ngày đầu tháng tới ngày cuối tháng hiện tại
    let timeNow = new Date();
    let year = timeNow.getFullYear();
    let month = timeNow.getMonth() + 1;
    let numberDay = new Date(year,month,0).getDate();
    this.time_start = month.toString() + '/01/' + year.toString();
    this.time_end = month.toString() + '/' + numberDay.toString() + '/' + year.toString();
  }
  getAllModelNo() {
    this.mesMoService.getModelNo().subscribe(res => {
        this.modelNoList = res.map(obj => {
          return { id: obj.toString(), text: obj.toString()};
        });
        this.modelNoList.unshift({id: "All", text: "All"})
    })
  }
  changedmodelNo(e: any): void {
    this.model_no = e;
    if(this.model_no !== "" && this.model_no !== null && this.model_no !== undefined) {
      this.mesMoService.getModelName(this.model_no).subscribe(res => {
        this.model_name = res.dataResult;
      })
    }
  }
  getAllLine() {
    this.auditRecService.getListLine().subscribe(res => {
      this.lineList = res.map(obj => {
        return {id: obj.id.toString(), text: obj.text.toString()};
      });
      this.lineList.unshift({id: "All", text: "All"})
    })
  }
  changeLine(e: any): void {
    this.line = e;
  }
  getAllType() {
    this.chartService.getTypes().subscribe(res => {
      this.typeList = res.map(obj => {
        return {
          id: obj.audit_Type_ID.toString(), 
          text: obj.audit_Kind + '-' + obj.audit_Type1 + '-' + obj.audit_Type2
        };
      });
      this.typeList.unshift({id: "All", text: "All"});
    })
  }
  changedType(e: any): void {
    this.type = e;
  }
  search() {
    let param;
    param = {
      line: this.line,
      model_No: this.model_no,
      status: this.status,
      type: this.type
    }
    let isQuery = true;
    if(this.time_start === undefined || this.time_start === '' || this.time_start === null) {
      if(this.time_start !== undefined && this.time_start !== '' && this.time_start !== null) {
        isQuery = false;
        this.alertify.error('Please option start time!');
      } else {
        isQuery = true;
        param = {
          fromDate: "",
          toDate: "",
          line: this.line,
          model_No: this.model_no,
          status: this.status,
          type: this.type
        }
      }
    } else {
      if(this.time_end === undefined || this.time_end === '' || this.time_end === null) {
        isQuery = false;
        this.alertify.error('Please option end time!');
      } else {
        isQuery = true;
        let form_date = this.functionUtility.getDateFormat(new Date(this.time_start));
        let to_date = this.functionUtility.getDateFormat(new Date(this.time_end));
        param = {
          fromDate: form_date,
          toDate: to_date,
          line: this.line,
          model_No: this.model_no,
          status: this.status,
          type: this.type
        }
      }
    }
    if(isQuery) {
      this.spinner.show();
      this.dataChart = [];
      this.titleX = [];
      this.columnName = [];
      this.chartService.getChartByMonthly(param).subscribe((res) => {
        if(res.dataChart.length === 0) {
          this.alertify.error("No data!");
        } else {
          this.dataChart = res.dataChart;
          this.titleX = res.titleX;
          this.columnName = res.columnName;
          console.log(this.dataChart);
          this.chartOptions = {
            chart: {
              type: "column",
            },
            title: {
              text: "Chart by monthly ",
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
        }
        this.spinner.hide();
      });
    }
  }
  clear() {
    this.dataChart = [];
    this.titleX = [];
    this.columnName = [];
    this.status = '';
    this.type = '';
    this.line = '';
    this.model_no = '';
    this.model_name = '';
    this.setTimeByMonthly();
  }
  exportExcel() {
    let timeStart =this.functionUtility.getDateFormat(
      new Date(this.time_start)
    );
    let timeEnd = this.functionUtility.getDateFormat(
      new Date(this.time_end)
    )
      if ( this.time_end == "" || this.time_start == "") {
        this.alertify.error("Please option Date !!!");
        return;
      }
        let object = {
          pdc: "",
          status: this.status === 'All' ? '' : this.status,
          building:  "",
          line:  this.line === 'All' ? '' :this.line,
          model_Name: "",
          model_No: this.model_no === 'All' ? '' :this.model_no,
          audit_Type_1: this.type === 'All' ? '' : this.type,
          audit_Type_2:"",
          from_Date: timeStart,
          to_Date: timeEnd,
        };
        this.chartService.exportExcel(object);
    
  }
}
