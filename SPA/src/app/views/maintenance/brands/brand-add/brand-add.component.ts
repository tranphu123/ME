import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../../_core/_services/brand.service';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { AuthService } from '../../../../_core/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.scss']
})
export class BrandAddComponent implements OnInit {
  brand: any = {};
  flag = '0';
  constructor(
    private brandService: BrandService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.brandService.currentBrand.subscribe(brand => this.brand = brand);
    this.brandService.currentFlag.subscribe(flag => this.flag = flag);
  }

  backList() {
    this.router.navigate(['/maintenance/brand']);
  }

  saveAndNext() {
    console.log(this.brand);
    if (this.flag === '0') {
      this.brandService.createBrand(this.brand).subscribe(
        () => {
          this.alertify.success('Add succeed');
          this.brand = {};
          //  this.router.navigate(["/maintenance/brand"])
        },
        error => {
          this.alertify.error(error);
        }
      );
    } else {
      this.brandService.updateBrand(this.brand).subscribe(
        () => {
          this.alertify.success('Updated succeed');
          this.router.navigate(['/maintenance/brand']);
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }

  save() {
    if (this.flag === '0') {
      this.brandService.createBrand(this.brand).subscribe(
        () => {
          this.alertify.success('Add succeed');
         // this.brand = {};
          this.router.navigate(['/maintenance/brand']);
        },
        error => {
          this.alertify.error(error);
        }
      );
    } else {
      this.brandService.updateBrand(this.brand).subscribe(
        () => {
          this.alertify.success('Updated succeed');
          this.router.navigate(['/maintenance/brand']);
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }

  cancel() {
    this.brand = {};
  }
}
