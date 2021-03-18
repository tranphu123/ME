import { Component, OnInit, TemplateRef } from "@angular/core";
import { Select2OptionData } from "ng-select2";
import { BrandService } from "../../../../_core/_services/brand.service";
import { AlertifyService } from "../../../../_core/_services/alertify.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MovieQueryManagementService } from "../../../../_core/_services/movie-query-management.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../../../environments/environment';
import { Pagination } from '../../../../_core/_models/pagination';

@Component({
  selector: "app-movie-query-management",
  templateUrl: "./movie-query-management.component.html",
  styleUrls: ["./movie-query-management.component.scss"]
})
export class MovieQueryManagementComponent implements OnInit {
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1,
  };
  url =environment.videoUrl;
  auditType: Array<Select2OptionData>;
  brands: Array<Select2OptionData>;
  auditItems: Array<Select2OptionData>;
  auditTypeD:any;
  audit_Type_ID: string = "";
  brand: string;
  latest: any = true;
  versions: Array<Select2OptionData>;
  version: string ;
  text: string = "";
  auditItem: string = "all";
  modalRef: BsModalRef;
  lang: string = "LL";
  constructor(
    private brandService: BrandService,
    private alertify: AlertifyService,
    private movieQueryManagementService: MovieQueryManagementService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    console.log(this.version);
    this.getAllBrands();
    this.spinner.hide();
  }
  loadData() {
    let Object = {
      brand: this.brand,
       version: this.version.toString(),
      latest: this.latest,
      text: this.text,
      audit_Type_ID: this.audit_Type_ID,
      auditItem: this.auditItem=="all"?"":this.auditItem

    };
    this.movieQueryManagementService.search(this.pagination.currentPage, this.pagination.itemsPerPage,Object).subscribe(res => {
      this.auditTypeD=res.result;
      this.pagination = res.pagination
    }),
    error=>{
      this.alertify.error(error)
    };
  }
  Seacher() {
    this.pagination.currentPage =1;
    this.loadData();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadData();
  }
  getAllBrands() {
    this.brandService.getAllBrands().subscribe(
      data => {
        this.brands = data.map(item => {
          return {
            id: item.brand_ID,
            text: item.brand_ID + " - " + item.brand_EN
          };
        });
        this.brand = this.brands[0].id;
        this.getAllAuditTypeM(1);
      },
      error => {
        this.alertify.error(error);
      }
    );

  }
  getAllAuditTypeM(number) {
    this.movieQueryManagementService.GetAllAudittype(this.brand).subscribe(
      data => {
        console.log(data);
        this.auditType = data.map(item => {
          return {
            id: item.audit_Type_ID,
            text: item.audit_Type1 + " - " + item.audit_Type2
          };
        });
        if (this.auditType.length != 0) {
          this.audit_Type_ID = this.auditType[0].id;
          this.GetAllAuditItem();
          this.GetAllVersion(number);
        }
      },
      error => {
        this.alertify.error(error);
      }
    );
  }
  GetAllVersion(number) {
    this.movieQueryManagementService
      .GetAllVersion(this.audit_Type_ID)
      .subscribe(
        data => {
          this.versions = data.map(item => {
            return {
              id: item,
              text: item
            };
          });
          this.version = this.versions[0].id;
          if(number ==1)
          {
            this.loadData();
          }
        },
        error => {
          this.alertify.error(error);
        }
      );

  }
  GetAllAuditItem() {
    this.movieQueryManagementService
      .getAllAuditItem(this.audit_Type_ID)
      .subscribe(
        data => {
          this.auditItems = data.map(item => {
            return {
              id: item.audit_Item_ID,
              text: item.audit_Item_ID
            };
          });
          this.auditItems.unshift({ id: "all", text: "All" });
        },
        error => {
          this.alertify.error(error);
        }
      );
  }
  brandChange() {
    this.audit_Type_ID ="";
    this.version="";
    this.getAllAuditTypeM(0);
  }
  auditTypeChange() {
    this.auditItem="all";
    this.version ="";
    if(this.audit_Type_ID=="")
    {
      // this.versions=[];
       this.auditItems =[];
      return;
    }
    this.GetAllVersion(0);
    this.GetAllAuditItem();
  }
  openVideo(template: TemplateRef<any>,item){
    if(item.movie_Name=="" || item.movie_Name==undefined||item.movie_Name==null )
    {
      this.alertify.error("Video Not Declare")
      return;
    }
    this.url =environment.videoUrl;
    this.url = this.url +item.movie_Name
    this.modalRef = this.modalService.show(template);
  }
  errorVideo(){
    this.alertify.error("Video Had Been Change or Delete")
  }
  changeLanguage(event: any){
    this.lang = event;
    this.loadData();
  }
   
}
