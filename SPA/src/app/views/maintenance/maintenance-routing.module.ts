import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandListComponent } from './brands/brand-list/brand-list.component';
import { BrandListResolver } from '../../_core/_resolvers/brand-list.resolver';
import { BrandAddComponent } from './brands/brand-add/brand-add.component';
import { TypeListComponent } from './audit-type/type-list/type-list.component';
import { TypeAddComponent } from './audit-type/type-add/type-add.component';
import { AuditTypeListResolver } from '../../_core/_resolvers/audit-type-list.resolver';
import { AuditTypeDListResolver } from '../../_core/_resolvers/audit-typeD-list.resolver';
import { AuditTypeDListComponent } from './audit-type-d/audit-type-d-list/audit-type-d-list.component';
import { AuditTypeDAddComponent } from './audit-type-d/audit-type-d-add/audit-type-d-add.component';
import { AuditPicMListComponent } from './audit-pic-m/audit-pic-m-list/audit-pic-m-list.component';
import { AuditPicMListResolver } from '../../_core/_resolvers/audit-pic-m-list.resolver';
import { AuditPicMAddComponent } from './audit-pic-m/audit-pic-m-add/audit-pic-m-add.component';
import { AuditPicDListComponent } from './audit-pic-d/audit-pic-d-list/audit-pic-d-list.component';
import { AuditPicDListResolver } from '../../_core/_resolvers/audit-pic-d-list.resolver';
import { AuditPicDAddComponent } from './audit-pic-d/audit-pic-d-add/audit-pic-d-add.component';
import { AuditRecDListComponent } from './audit-rec-d/audit-rec-d-list/audit-rec-d-list.component';
import { AuditRecViewModelListResolver } from '../../_core/_resolvers/audit-rec-viewmodel-list.resolver';
import { AuditRecDAddComponent } from './audit-rec-d/audit-rec-d-add/audit-rec-d-add.component';
import { AuditRecMAddComponent } from './audit-rec-d/audit-rec-m-add/audit-rec-m-add.component';
import { AuditRecMListComponent } from './audit-rec-d/audit-rec-m-list/audit-rec-m-list.component';
import { AuditRecMListResolver } from '../../_core/_resolvers/audit-rec-m-list.resolver';
import { AuditRecListComponent } from './audit-rec-d/audit-rec-list/audit-rec-list.component';
import { AuditRecDListResolver } from '../../_core/_resolvers/audit-rec-d-list-resolver';
import { SmeScoreRecordListComponent } from './sme-score-record/sme-score-record-list/sme-score-record-list.component';
import { SixsScoreRecordListComponent } from './sixs-score-record/sixs-score-record-list/sixs-score-record-list.component';
import { WaterSpiderScoreRecordListComponent } from './water-spider-score-record/water-spider-score-record-list/water-spider-score-record-list.component';
import { SixsScoreRecordDetailComponent } from './sixs-score-record/sixs-score-record-detail/sixs-score-record-detail.component';
import { SmeScoreRecordDetailComponent } from './sme-score-record/sme-score-record-detail/sme-score-record-detail.component';
import { WaterSpiderScoreRecordDetailComponent } from './water-spider-score-record/water-spider-score-record-detail/water-spider-score-record-detail.component';
import { SmeScoreRecordEditComponent } from './sme-score-record/sme-score-record-edit/sme-score-record-edit.component';
import { SixsScoreRecordEditComponent } from './sixs-score-record/sixs-score-record-edit/sixs-score-record-edit.component';
import { WaterSpiderScoreRecordEditComponent } from './water-spider-score-record/water-spider-score-record-edit/water-spider-score-record-edit.component';




const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maintenance'
    },
    children: [
      {
        path: 'brand',
        children:
          [
            {
              path: '',
              component: BrandListComponent,
              resolve: { brands: BrandListResolver },
              data: {
                title: 'Brand'
              }
            },
            {
              path: 'add',
              component: BrandAddComponent,
              data: {
                title: 'Add new brand'
              }
            },
            {
              path: 'update',
              component: BrandAddComponent,
              data: {
                title: 'Update brand'
              }
            }
          ]
      },
      {
        path: 'audit-type',
        children:
          [
            {
              path: '',
              component: TypeListComponent,
              resolve: { auditTypes: AuditTypeListResolver },
              data: {
                title: 'Audit Types'
              }
            },
            {
              path: 'add',
              component: TypeAddComponent,
              data: {
                title: 'Add new audit type'
              }
            },
            {
              path: 'update',
              component: TypeAddComponent,
              data: {
                title: 'Update audit type'
              }
            }
          ]
      },
      {
        path: 'audit-type-d',
        children:
          [
            {
              path: '',
              component: AuditTypeDListComponent,
              data: {
                title: 'Audit Types D'
              }
            },
            {
              path: 'add',
              component: AuditTypeDAddComponent,
              data: {
                title: 'Add new audit type'
              }
            },
            {
              path: 'update',
              component: AuditTypeDAddComponent,
              data: {
                title: 'Update audit type'
              }
            }
          ]
      },
      {
        path: 'audit-pic-m',
        children:
          [
            {
              path: '',
              component: AuditPicMListComponent,
              resolve: { auditPics: AuditPicMListResolver },
              data: {
                title: 'Dept Setting'
              }
            },
            {
              path: 'add',
              component: AuditPicMAddComponent,
              data: {
                title: 'Add new Dept setting'
              }
            },
            {
              path: 'update',
              component: AuditPicMAddComponent,
              data: {
                title: 'Update Dept setting'
              }
            }
          ]
      },
      {
        path: 'audit-pic-d',
        children:
          [
            {
              path: '',
              component: AuditPicDListComponent,
              resolve: { auditPics: AuditPicDListResolver },
              data: {
                title: 'Dept Member Setting'
              }
            },
            {
              path: 'add',
              component: AuditPicDAddComponent,
              data: {
                title: 'Add new Dept Member'
              }
            },
            {
              path: 'update',
              component: AuditPicDAddComponent,
              data: {
                title: 'Update Dept Member'
              }
            }
          ]
      },
      {
        path: 'audit-rec',
        children:
          [
            {
              path: '',
              component: AuditRecListComponent,
              resolve: { auditRecs: AuditRecViewModelListResolver },
              data: {
                title: 'WT Tracking List'
              }
            },
            {
              path: 'audit-recM-list',
              component: AuditRecMListComponent,
              resolve: { auditRecMs: AuditRecMListResolver },
              data: {
                title: 'List Meeting Minutes'
              }
            },
            {
              path: 'audit-recD-list',
              component: AuditRecDListComponent,
              resolve: { auditRecDs: AuditRecDListResolver },
              data: {
                title: 'List WT Tracking List'
              }
            },
            {
              path: 'add-audit-recM',
              component: AuditRecMAddComponent,
              data: {
                title: 'Add new Meeting Minutes'
              }
            },
            {
              path: 'update-audit-recM',
              component: AuditRecMAddComponent,
              data: {
                title: 'Update Meeting Minutes'
              }
            },
            {
              path: 'add-audit-recD',
              component: AuditRecDAddComponent,
              data: {
                title: 'Add new WT Tracking List'
              }
            },
            {
              path: 'update-audit-recD',
              component: AuditRecDAddComponent,
              data: {
                title: 'Update WT Tracking List'
              }
            }
          ]
      },
      {
        path: 'sme-score-record',
        children:
          [
            {
              path: '',
              component: SmeScoreRecordListComponent,
              data: {
                title: 'SME Score Record'
              }
            },
            {
              path: 'detail/:recordId',
              component: SmeScoreRecordDetailComponent,
              data: {
                title: 'SME Score Record Detail'
              }
            },
            {
              path: 'edit/:recordId',
              component: SmeScoreRecordEditComponent,
              data: {
                title: 'SME Score Record Edit'
              }
            },
          ]
      },
      {
        path: '6s-score-record',
        children:
          [
            {
              path: '',
              component: SixsScoreRecordListComponent,
              data: {
                title: '6S Score Record'
              }
            },
            {
              path: 'detail',
              component: SixsScoreRecordDetailComponent,
              data: {
                title: '6S Score Record Detail'
              }
            },
            {
              path: 'edit',
              component: SixsScoreRecordEditComponent,
              data: {
                title: '6S Score Record Edit'
              }
            },
          ]
      },
      {
        path: 'water-spider-score-record',
        children:
          [
            {
              path: '',
              component: WaterSpiderScoreRecordListComponent,
              data: {
                title: 'Water Spider Score Record'
              }
            },
            {
              path: 'detail/:recordId',
              component: WaterSpiderScoreRecordDetailComponent,
              data: {
                title: 'Water Spider Score Record Detail'
              }
            },
            {
              path: 'edit/:recordId',
              component: WaterSpiderScoreRecordEditComponent,
              data: {
                title: 'Water Spider Score Record Edit'
              }
            },
          ]
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.module').then(
            m => m.ReportModule
          )
      },
      // {
      //   path: 'user',
      //   children:
      //     [
      //       {
      //         path: '',
      //         component: UserListComponent,
      //         data: {
      //           title: 'User'
      //         }
      //       },
      //     ]
      // },
      {
        path: 'setting',
        loadChildren: () =>
          import('./setting/setting.module').then(
            m => m.settingModule
          )
      },
      {
        path: 'chart',
        loadChildren: () =>
          import('./chart/chart.module').then(
            m => m.chartModule
          )
      }, 
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
