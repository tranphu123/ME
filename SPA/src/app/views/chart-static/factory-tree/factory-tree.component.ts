import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forEach } from 'lodash';
import { environment } from '../../../../environments/environment';
import { Factory } from '../../../_core/_models/chart-factory-tree';
import { ChartStaticService } from '../../../_core/_services/chart-static.service';
import { FunctionUtility } from '../../../_core/_utility/function-utility';


@Component({
  selector: 'app-factory-tree',
  templateUrl: './factory-tree.component.html',
  styleUrls: ['./factory-tree.component.scss']
})

export class FactoryTreeComponent implements OnInit {
  data: Factory = null;
  urlImage: any = environment.imageIcon;
  urlIconTreatment: any = environment.imageIconTreatment;
  constructor(private service: ChartStaticService, private utility :FunctionUtility, sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getDataFactoryTree().subscribe(res => {
      console.log("res", res)
      this.data = res;
      this.utility.addItemNull(this.data.listDept);
    })
  }

  checkImageIcon() {
    
  }

}
