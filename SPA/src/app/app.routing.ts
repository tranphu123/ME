import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent, ScopeRecordLayoutComponent, ChartStaticLayoutComponent } from './containers';

import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './_core/_guards/auth.guard';

export const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    // redirectTo: "/maintenance/audit-rec",
    redirectTo: "/dashboard",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login Page"
    }
  },
  {
    path:"chart-static",
    component:ChartStaticLayoutComponent,
    data:{
      title:"Chart-Static"
    },
    children:[{
      path:'factory-tree',
      loadChildren:() => import("./views/chart-static/chart-static.module").then(m => m .ChartStaticModule)
    }
  ]
    
  },
  {
    path: "record",
    component: ScopeRecordLayoutComponent,
    data: {
      title: "Record Page"
    },
    children: [
      {
        path: 'record-add',
        loadChildren: () => import("./views/score-record/score-record.module").then(m => m.ScoreRecordModule)
      }

    ]
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home"
    },
    children: [
      {
        path: "dashboard",
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            m => m.DashboardModule
          )
      },
      {
        path: "maintenance",
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/maintenance/maintenance.module").then(
            m => m.MaintenanceModule
          )
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
