import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { LoginService } from './../../../services/login.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { DepartmentService } from '../../../services/department.service';
import { WorkDayLogsService } from './../../../services/work-day-logs.service';
import { AlertComponent, AlertTypes } from './../../shared/alert/alert.component';

import { IWorkDayLogSearchParams } from './../../../models/requestParams.model';
import { ResponseJSONModel, ResponsePagingJSON, WorkDayLog, Department } from './../../../models/responseJson.model';

@Component({
  selector: 'app-log-search',
  templateUrl: './log-search.component.html',
  styleUrls: ['./log-search.component.scss']
})
export class LogSearchComponent implements OnInit {
  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;
  @Output() onParamsChanged = new EventEmitter<ResponsePagingJSON<WorkDayLog>>();
  currentDepartment: Department;
  date: string | Date = new Date();

  constructor(private loginService: LoginService, private dayLogService: WorkDayLogsService) { }
  ngOnInit() {
    //this.paramsChangeEmit();
  }
  ///改变日期
  changeDate(step: number) {
    let currentDate: any = this.date.toString();
    currentDate = new Date(currentDate.replace(/[^0-9]/g, '/'));
    currentDate.setDate(currentDate.getDate() + step);
    this.date = currentDate;
    this.paramsChangeEmit();
  }
  ///改变部门
  changeDepartment(item: Department) {
      this.currentDepartment = item;
      this.paramsChangeEmit();
  }
  paramsChangeEmit() {
    const params: IWorkDayLogSearchParams = {};
    if (typeof this.date === 'string') {
      params.date = (new Date(this.date)).format('yyyy/MM/dd');
    } else {
      params.date = this.date.format('yyyy/MM/dd');
    }
    if (this.currentDepartment.id !== '0') {
      params.departmentId = this.currentDepartment.id;
    }
    this.dayLogService.getDayLogs(params).subscribe((json: ResponseJSONModel<ResponsePagingJSON<WorkDayLog>>) => {
      if (this.loginService.logoutDialogGuard(this.myDialog, json)) {
        if (!json.status) {
          this.myAlert.showAlert('获取日志失败', json.message, AlertTypes.danger);
          return;
        }
        this.onParamsChanged.emit(json.data);
      }
    });
  }
}
