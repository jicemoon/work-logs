import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { ResponseJSONModel, UserInfo, WorkDayLog } from '../../../models/responseJson.model';
import { LoginService } from '../../../services/login.service';
import { WorkDayLogsService } from '../../../services/work-day-logs.service';
import { AlertComponent, AlertTypes } from '../../shared/alert/alert.component';
import {
    ConfirDialogOptions, ConfirmDialogComponent
} from '../../shared/confirm-dialog/confirm-dialog.component';
import {
    WorkDayLogDetailsDialogComponent
} from '../../shared/work-day-log-details-dialog/work-day-log-details-dialog.component';

@Component({
  selector: 'app-add-log',
  templateUrl: './add-log.component.html',
  styleUrls: ['./add-log.component.scss']
})
export class AddLogComponent implements OnInit {
  logId: string;
  isEdit: boolean;
  repeatLog: WorkDayLog;

  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;
  @ViewChild('dayLogDetails') dayLogDetails: WorkDayLogDetailsDialogComponent;

  currentLog: { id?: string, date: string, completed: string, plan: string, progress: string, user?: any};
  oldLog: { date: string, completed: string, plan: string, progress: string};
  constructor(
    private activetedRoute: ActivatedRoute,
    private router: Router,
    private workDayLogsService: WorkDayLogsService,
    private loginService: LoginService,
    private location: Location
  ) {
    this.resetInitData();
  }
  resetInitData() {
    this.currentLog = {
      date: (new Date()).format('yyyy-MM-dd'),
      completed: '',
      plan: '',
      progress: ''
    };
    this.oldLog = Object.assign({}, this.currentLog);
  }
  ngOnInit() {
    this.activetedRoute.paramMap.switchMap((params: ParamMap, idx: number) => {
      const id = params.get('id');
      this.isEdit = !!id;
      if (!id) {
        return Observable.create(observer => {
          observer.next(null);
          observer.complete();
        });
      }
      else {
        return this.workDayLogsService.getDayLogById(id);
      }
    }).subscribe((json: null | ResponseJSONModel<WorkDayLog>) => {
      if (!json) {
        this.resetInitData();
      } else if (json.status) {
        this.logId = json.data.id;
        this.currentLog.date = json.data.date;
        this.currentLog.completed = json.data.completed;
        this.currentLog.plan = json.data.plan;
        this.currentLog.progress = json.data.progress;
        this.currentLog.user = json.data.user.id;
        this.oldLog = Object.assign({}, this.currentLog);
      }
    });
  }
  previewDayLog() {
    this.dayLogDetails.showDialog(this.currentLog, {
      showHeader: false
    });
  }
  saveDayLog() {
    const validitions = this.validityDayLog();
    if (validitions) {
      this.myAlert.showAlert('', validitions, AlertTypes.warning);
      return;
    }
    let observerSave: Observable<ResponseJSONModel<WorkDayLog>>;
    if (this.isEdit) {
      observerSave = this.workDayLogsService.putDayLog(this.logId, this.currentLog);
    } else {
      if (this.repeatLog) {
        this.currentLog.id = this.repeatLog.id;
      }
      observerSave = this.workDayLogsService.postDayLog(this.currentLog);
    }
    observerSave.subscribe((json) => {
      if (!this.loginService.logoutDialogGuard(this.myDialog, json)) {
        return;
      }
      if (json.status) {
        if (this.isEdit) {
          this.myAlert.showAlert('保存成功', '正在跳转至我的日志, 请稍候...', AlertTypes.success);
          setTimeout(() => {
            this.router.navigate(['myLogs']);
          }, 1000);
        } else {
          this.resetInitData();
          this.myAlert.showAlert('保存成功', '新增日志成功', AlertTypes.success);
        }
        this.repeatLog = null;
      } else if (json.data) {
        //有重复日期的日志
        this.repeatLog = json.data;
        this.myDialog.showDialog({
          content: `<strong>${json.message}</strong>, 强制保存将会覆盖原来的日志内容, 是否强制保存`,
          okText: '是',
          cancelText: '否',
          okHandle: () => {
            this.saveDayLog();
            return true;
          }
        });
      } else {
        //失败
        this.myAlert.showAlert('保存失败', json.message, AlertTypes.danger);
      }
    });
  }
  back() {
    if (this.currentLog.date !== this.oldLog.date
      || this.currentLog.completed !== this.oldLog.completed
      || this.currentLog.plan !== this.oldLog.plan
      || this.currentLog.progress !== this.oldLog.progress) {
      this.myDialog.showDialog({
        title: '',
        content: '您的日志已经修改, 确认要返回吗? ',
        okHandle: () => {
          this.location.back();
          return true;
        }
      });
    } else {
      this.location.back();
    }
  }
  validityDayLog() {
    let rtn;
    switch (true) {
      case (/^\s*$/.test(this.currentLog.date)):
        rtn = '日期不能为空';
        break;
      case (/^\s*$/.test(this.currentLog.completed)):
        rtn = '今日完成不能为空';
        break;
      case (/^\s*$/.test(this.currentLog.plan)):
        rtn = '明日计划不能为空';
        break;
      case (/^\s*$/.test(this.currentLog.progress)):
        rtn = '工作进度不能为空';
        break;
    }
    return rtn;
  }
}
