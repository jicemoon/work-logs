import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { IndexComponent } from './components/pages/index/index.component';
import { AllLogsComponent } from './components/pages/all-logs/all-logs.component';
import { AddLogComponent } from './components/pages/add-log/add-log.component';
import { AddMonthReportComponent } from './components/pages/add-month-report/add-month-report.component';
import { UserInfosComponent } from './components/pages/user-infos/user-infos.component';
import { MyLogsComponent } from './components/pages/my-logs/my-logs.component';
import { UserListComponent } from './components/pages/user-list/user-list.component';
import { DepartmentListComponent } from './components/pages/department-list/department-list.component';

import { AuthGuardService } from './services/auth-guard.service';
import { AdminGuardService } from './services/admin-guard.service';

const routeComponents = [
  LoginComponent,
  IndexComponent,
  AllLogsComponent,
  AddLogComponent,
  AddMonthReportComponent,
  UserInfosComponent,
  MyLogsComponent,
  UserListComponent,
  DepartmentListComponent
];
export { routeComponents };
const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'allLogs',
        pathMatch: 'full'
      },
      {
        path: 'allLogs',
        component: AllLogsComponent
      },
      {
        path: 'myLogs',
        component: MyLogsComponent
      },
      {
        path: 'addDayLog',
        component: AddLogComponent
      },
      {
        path: 'addDayLog/:id',
        component: AddLogComponent
      },
      {
        path: 'addMonthReport',
        component: AddMonthReportComponent
      },
      {
        path: 'userInfos',
        component: UserInfosComponent
      },
      {
        path: 'userList',
        canActivate: [AdminGuardService],
        canActivateChild: [AdminGuardService],
        component: UserListComponent
      },
      {
        path: 'departmentList',
        canActivate: [AdminGuardService],
        canActivateChild: [AdminGuardService],
        component: DepartmentListComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
