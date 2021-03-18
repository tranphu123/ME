import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { LineListComponent } from './line/line-list/line-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
const routes: Routes = [
  {
    path: "",
    data: {
      title: "setting",
    },
    children: [
      {
        path: "user",
        component: UserListComponent,
        data: {
          title: "user-list",
        },
      },
      {
        path: "show-line",
        component: LineListComponent,
        data: {
          title: "show-line-list",
        },
    }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
