// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelect2Module } from 'ng-select2';
//Components Routing
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SettingRoutingModule } from './setting-routing.module';
import { UserListComponent } from './user/user-list/user-list.component';
import { LineListComponent } from './line/line-list/line-list.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    PaginationModule,
    SettingRoutingModule,
    NgSelectModule,
    BsDropdownModule,
    NgSelect2Module,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    UserListComponent,
    LineListComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})

export class settingModule {
}
