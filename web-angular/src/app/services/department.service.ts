import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { paramsToQuery } from '../commen-utils/utils';
import { URL_ROOT, IDepartment } from './../models/requestParams.model';
import { ResponseJSONModel, Department } from './../models/responseJson.model';

@Injectable()
export class DepartmentService {
  headers: HttpHeaders;
  urlDepartment: string;

  constructor(private loginService: LoginService, private http: HttpClient) {
    this.headers = new HttpHeaders().set('token', this.loginService.userInfo.token);
    this.urlDepartment = `${URL_ROOT}/department`;
  }
  /**
   * 批量获取部门列表
   */
  getDepargments(): Observable<ResponseJSONModel<Department[]>> {
    return this.http.get<ResponseJSONModel<Department[]>>(this.urlDepartment, {headers: this.headers} );
  }
  /**
   * 根据id获取单个部门信息
   * @param id
   */
  getDepargment(id: string): Observable<ResponseJSONModel<Department>> {
    return this.http.get<ResponseJSONModel<Department>>(`${this.urlDepartment}/${id}`, {headers: this.headers} );
  }
  /**
   * 新增部门信息
   * @param params
   */
  postDepartment(params: IDepartment): Observable<ResponseJSONModel<Department>> {
    return this.http.post<ResponseJSONModel<Department>>(this.urlDepartment, params, {headers: this.headers});
  }
  /**
   * 根据id修改部门信息
   * @param params
   * @param id
   */
  putDepartment(params: IDepartment, id): Observable<ResponseJSONModel<Department>> {
    return this.http.put<ResponseJSONModel<Department>>(`${this.urlDepartment}/${id}`, params, {headers: this.headers});
  }

  /**
   * 根据id删除部门
   */
  deleteDepartmentById (id?: string): Observable<ResponseJSONModel<Department>> {
    return this.http.delete<ResponseJSONModel<Department>>(`${this.urlDepartment}/${id}`, { headers: this.headers});
  }
}
