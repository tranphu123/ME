import { Component, OnInit } from '@angular/core';
import { PaginatedResult, Pagination } from '../../../../_core/_models/pagination';
import { Brand } from '../../../../_core/_models/brand';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../../_core/_services/brand.service';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { User } from '../../../../_core/_models/user';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit {
  brands: Brand[];
  brand: any = {};
  user: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  text: string;
  searchKey = false;
  constructor(private brandService: BrandService, private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.brandService.currentBrand.subscribe(brand => this.brand = brand);
    this.route.data.subscribe(data => {
      this.spinner.hide();
      this.brands = data['brands'].result;
      this.pagination = data['brands'].pagination;
    });

  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadBrands();
  }

  loadBrands() {
   // this.spinner.show();
    if (this.searchKey === false) {
    this.brandService.getBrands(this.pagination.currentPage, this.pagination.itemsPerPage)
    .subscribe((res: PaginatedResult<Brand[]>) => {
      this.brands = res.result;
      this.pagination = res.pagination;
  //    this.spinner.hide();
    }, error => {
      this.alertify.error(error);
    });
  } else {
    this.brandService.search(this.pagination.currentPage, this.pagination.itemsPerPage, this.text)
    .subscribe((res: PaginatedResult<Brand[]>) => {
      this.brands = res.result;
      this.pagination = res.pagination;
      console.log('Search: ', this.brands);
    }, error => {
      this.alertify.error(error);
    });
    }
  }

  addBrand() {
    this.brand = {};
    this.brandService.changeBrand(this.brand);
    this.brandService.changeFlag('0');
    this.router.navigate(['/maintenance/brand/add']);
  }

  changeStatus(id: number) {
    this.brandService.changeStatus(id)
      .subscribe(() => {
        this.alertify.success('Change active succeed');
      }, error => {
        this.alertify.error(error);
      });
  }

  changeToEdit(brand: Brand) {
    this.brandService.changeBrand(brand);
    this.brandService.changeFlag('1');
    this.router.navigate(['/maintenance/brand/update']);
  }

  deleteBrand(brand: Brand) {
    this.alertify.confirm('Delete Brand', 'Are you sure you want to delete this Brand_ID "' + brand.brand_ID + '" ?', () => {
      this.brandService.deleteBrand(brand.brand_ID).subscribe(() => {
        this.loadBrands();
        this.alertify.success('Brand has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the Brand');
      });
    });
  }

  searchBrand() {
    if (this.text !== '') {
      this.searchKey = true;
      this.brandService.search(this.pagination.currentPage, this.pagination.itemsPerPage, this.text)
        .subscribe((res: PaginatedResult<Brand[]>) => {
          this.brands = res.result;
          this.pagination = res.pagination;
          console.log('Search: ', this.brands);
        }, error => {
          this.alertify.error(error);
        });
    } else {
      this.searchKey = false;
      this.loadBrands();
    }
  }

}
