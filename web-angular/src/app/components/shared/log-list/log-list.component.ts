import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WorkDayLog } from '../../../models/responseJson.model';
import { LoginService } from '../../../services/login.service';
import { WorkDayLogsService } from '../../../services/work-day-logs.service';
import { AlertComponent, AlertTypes } from '../alert/alert.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import {
    WorkDayLogDetailsDialogComponent,
    WorkDayLogDetailsDialogOptions
} from '../work-day-log-details-dialog/work-day-log-details-dialog.component';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit {
  @Input() logList: WorkDayLog[];
  currentUserId: string;
  currentDetailLog: WorkDayLog;

  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;
  @ViewChild('dayLogDetails') dayLogDetails: WorkDayLogDetailsDialogComponent;

  constructor(private loginService: LoginService, private dayLogService: WorkDayLogsService) {
    this.currentUserId = this.loginService.userInfo.id;
  }
  showDetails(log: WorkDayLog) {
    this.currentDetailLog = log;
    this.dayLogDetails.showDialog(this.currentDetailLog);
  }
  deleteLog(log: WorkDayLog) {
    this.myDialog.showDialog({
      content: `<span class="text-danger">您确定要删除日期为(<strong>${log.date}</strong>)的日志吗</span>`,
      okHandle: (): boolean => {
        this.dayLogService.deleteDayLog(log.id).subscribe(json => {
          if (this.loginService.logoutDialogGuard(this.myDialog, json)) {
            if (json.status) {
              this.logList.splice(this.logList.indexOf(log), 1);
            }
            this.myAlert.showAlert('', json.message, json.status ?  AlertTypes.success : AlertTypes.danger);
          }
        });
        return true;
      }
    });
  }
  ngOnInit() {
  }
}
