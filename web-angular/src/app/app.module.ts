import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { CookieModule } from 'ngx-cookie';
import { MarkdownModule } from 'angular2-markdown';

import '../../../server/src/common/prototype.extends';
import { AppRoutingModule, routeComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import {
    ConfirmDialogComponent
} from './components/shared/confirm-dialog/confirm-dialog.component';
import {
    DepartmentDropdownComponent
} from './components/shared/department-dropdown/department-dropdown.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { LogListComponent } from './components/shared/log-list/log-list.component';
import { LogSearchComponent } from './components/shared/log-search/log-search.component';
import { ModalComponent } from './components/shared/modal/modal.component';
import './configs/date-picker-locale';
import { AdminGuardService } from './services/admin-guard.service';
import { AuthGuardService } from './services/auth-guard.service';
import { DepartmentService } from './services/department.service';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';
import { WorkDayLogsService } from './services/work-day-logs.service';
import { WorkDayLogDetailsDialogComponent } from './components/shared/work-day-log-details-dialog/work-day-log-details-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HeaderComponent,
    LogSearchComponent,
    FooterComponent,
    LogListComponent,
    ...routeComponents,
    DepartmentDropdownComponent,
    ModalComponent,
    ConfirmDialogComponent,
    WorkDayLogDetailsDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CookieModule.forRoot(),
    MarkdownModule.forRoot(),
    NguiDatetimePickerModule
  ],
  providers: [
    LoginService,
    AuthGuardService,
    AdminGuardService,
    DepartmentService,
    WorkDayLogsService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
