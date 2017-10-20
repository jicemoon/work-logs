import { ConfirmDialogComponent } from './../../shared/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LoginService } from './../../../services/login.service';
import { WorkDayLogsService } from './../../../services/work-day-logs.service';

import { IWorkDayLogSearchParams } from './../../../models/requestParams.model';
import { ResponseJSONModel, ResponsePagingJSON, WorkDayLog, Department } from './../../../models/responseJson.model';
import { AlertComponent, AlertTypes } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-my-logs',
  templateUrl: './my-logs.component.html',
  styleUrls: ['./my-logs.component.scss']
})
export class MyLogsComponent implements OnInit {

  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;
  logList: WorkDayLog[];
  constructor(private loginService: LoginService, private workDayLogsService: WorkDayLogsService) { }

  ngOnInit() {
    this.getMyWorkDayLogs();
  }
  getMyWorkDayLogs() {
    const params: IWorkDayLogSearchParams = { userId: this.loginService.userInfo.id };
    this.workDayLogsService.getDayLogs(params).subscribe((json: ResponseJSONModel<ResponsePagingJSON<WorkDayLog>>) => {
      if (!this.loginService.logoutDialogGuard(this.myDialog, json)) {
        return;
      }
      if (json.status) {
        this.logList = json.data.dataList;
      } else {
        this.myAlert.showAlert('获取日志失败', json.message, AlertTypes.danger);
      }
    });
  }
}
