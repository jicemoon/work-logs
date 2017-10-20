import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { paramsToQuery } from '../commen-utils/utils';
import { IWorkDayLog, IWorkDayLogSearchParams, URL_ROOT } from '../models/requestParams.model';
import { ResponseJSONModel, ResponsePagingJSON, WorkDayLog } from '../models/responseJson.model';
import { LoginService } from './login.service';

@Injectable()
export class WorkDayLogsService {
  headers: HttpHeaders;
  urlWorkDayLog: string;

  constructor(private loginService: LoginService, private http: HttpClient) {
    this.headers = new HttpHeaders().set('token', this.loginService.userInfo.token);
    this.urlWorkDayLog = `${URL_ROOT}/workDayLog`;
  }
  /**
   * 批量获取日志
   */
  getDayLogs(params: IWorkDayLogSearchParams): Observable<ResponseJSONModel<ResponsePagingJSON<WorkDayLog>>> {
    const paramQuery = paramsToQuery(params);
    return this.http.get<ResponseJSONModel<ResponsePagingJSON<WorkDayLog>>>(`${this.urlWorkDayLog}${paramQuery}`, {headers: this.headers} ).map( json => {
      if (json.status) {
        json.data.dataList.forEach((item) => {
          item.completed = item.completed.replace(/\n|\r/g, '\n ');
          item.plan = item.plan.replace(/\n|\r/g, '\n ');
          item.progress = item.progress.replace(/\n|\r/g, '\n ');
        });
      }
      return json;
    });
  }
  /**
   * 根据id获取单个日志
   */
  getDayLogById(id: string): Observable<ResponseJSONModel<WorkDayLog>> {
    return this.http.get<ResponseJSONModel<WorkDayLog>>(`${this.urlWorkDayLog}/${id}`, {headers: this.headers} ).map( json => {
      if (json.status) {
        json.data.completed = json.data.completed.replace(/\n|\r/g, '\n ');
        json.data.plan = json.data.plan.replace(/\n|\r/g, '\n ');
        json.data.progress = json.data.progress.replace(/\n|\r/g, '\n ');
      }
      return json;
    });
  }
  /**
   * 新增日志
   */
  postDayLog(params: WorkDayLog): Observable<ResponseJSONModel<WorkDayLog>> {
    if (typeof params.date !== 'string') {
      params.date = new Date(params.date).format('yyyy-MM-dd');
    }
    return this.http.post<ResponseJSONModel<WorkDayLog>>(`${this.urlWorkDayLog}`, params, {headers: this.headers});
  }
  /**
   * 修改日志
   */
  putDayLog(id: string, params: WorkDayLog): Observable<ResponseJSONModel<WorkDayLog>> {
    return this.http.put<ResponseJSONModel<WorkDayLog>>(`${this.urlWorkDayLog}/${id}`, params, {headers: this.headers});
  }
  /**
   * 删除日志
   */
  deleteDayLog(id: string): Observable<ResponseJSONModel<WorkDayLog>> {
    return this.http.delete<ResponseJSONModel<WorkDayLog>>(`${this.urlWorkDayLog}/${id}`, {headers: this.headers});
  }
}
