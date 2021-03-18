import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighchartsChartModule } from 'highcharts-angular';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent, ScopeRecordLayoutComponent, ChartStaticLayoutComponent } from './containers';

import { LoginComponent } from './views/login/login.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';

// Import service
import { AuthService } from '../app/_core/_services/auth.service';
import { ErrorInterceptorProvider } from './_core/_services/error.interceptor';
import { AlertifyService } from './_core/_services/alertify.service';
import { AuthGuard } from './_core/_guards/auth.guard';
import { BrandListResolver } from './_core/_resolvers/brand-list.resolver';
import { CategoryListResolver } from './_core/_resolvers/category-list.resolver';
import { CategoryEditResolver } from './_core/_resolvers/category-edit.resolver';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AuditTypeListResolver } from './_core/_resolvers/audit-type-list.resolver';
import { AuditTypeDListResolver } from './_core/_resolvers/audit-typeD-list.resolver';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuditPicMListResolver } from './_core/_resolvers/audit-pic-m-list.resolver';
import { AuditPicDListResolver } from './_core/_resolvers/audit-pic-d-list.resolver';
import { AuditRecViewModelListResolver } from './_core/_resolvers/audit-rec-viewmodel-list.resolver';
import { AuditRecMListResolver } from './_core/_resolvers/audit-rec-m-list.resolver';
import { AuditRecDListResolver } from './_core/_resolvers/audit-rec-d-list-resolver';
import { SMEStaticChartResolve } from './_core/_resolvers/sme-chart-static.resolver';
import { WebcamModule } from 'ngx-webcam';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    NgSelectModule,
    HighchartsChartModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    ChartsModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // whitelistedDomains: ['10.4.0.75:3030'],
        // blacklistedRoutes: ['10.4.0.75:3030/api/auth'],
        // whitelistedDomains: ["localhost:5000"],
        // blacklistedRoutes: ["localhost:5000/api/auth"]
        whitelistedDomains: ['10.4.0.78:2020'],
        blacklistedRoutes: ['10.4.0.78:2020/api/auth']
      }
    })
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    LoginComponent,
    ScopeRecordLayoutComponent,
    ChartStaticLayoutComponent
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    AlertifyService,
    AuthGuard,
    BrandListResolver,
    AuditTypeListResolver,
    AuditTypeDListResolver,
    AuditPicMListResolver,
    AuditRecMListResolver,
    AuditRecDListResolver,
    AuditPicDListResolver,
    AuditRecViewModelListResolver,
    CategoryListResolver,
    CategoryEditResolver,
    SMEStaticChartResolve,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
