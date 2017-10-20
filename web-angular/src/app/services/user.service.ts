import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/catch';

import { LoginService } from './login.service';

import { ResponseJSONModel, ResponsePagingJSON, UserInfo, Department } from './../models/responseJson.model';
import { URL_ROOT } from '../models/requestParams.model';


@Injectable()
export class UserService {
  headers: HttpHeaders;
  urlUser: string;
  private currentUser: UserInfo;
  constructor(private http: HttpClient, private loginService: LoginService) {
    this.currentUser = this.loginService.userInfo;
    this.headers = new HttpHeaders().set('token', this.loginService.userInfo.token);
    this.urlUser = `${URL_ROOT}/user`;
  }
  /**
   * 当前登录账户权限验证
   * @param departmentId 新建/修改的用户部门id, 或者批量查询的部门id
   */
  permissionAuthentication<T>(departmentId?: string): {error: boolean, message: Observable<ResponseJSONModel<T>>|null, departmentId?: string} {
    const cl = this.currentUser.level;
    const di = (this.currentUser.department as Department).id;
    let error = false, message = null;
    if (departmentId === '0') {
      departmentId = undefined;
    }
    if (cl === 2 || (cl === 1 && departmentId && departmentId !== di)) {
      error = true;
      message = '您没有此权限, 请联系管理员! ';
    }
    if (cl === 1 && !departmentId) {
      departmentId = di;
    }
    const rtn = { error, message: null, departmentId };
    if (error) {
      rtn.message = Observable.create( observe => {
        observe.next(new ResponseJSONModel<T>({isLogin: true, status: false, message}));
        observe.complete();
      });
    }
    return rtn;
  }
  /**
   * 获取该部门或全部用户列表
   * 超级管理员可以增加/修改/查询任何部门的人员, 管理员只能增加/修改/查询本部门的人员
   */
  getUsers(departmentId?: string): Observable<ResponseJSONModel<UserInfo[]>> {
    let query = '';
    const auth = this.permissionAuthentication<UserInfo[]>(departmentId);
    if (auth.error) {
      return auth.message;
    }
    departmentId = auth.departmentId;
    if (departmentId) {
      query = `?departmentId=${departmentId}`;
    }
    return this.http.get<ResponseJSONModel<UserInfo[]>>(`${this.urlUser + query}`, { headers: this.headers});
  }
  /**
   * 根据id获取用户详细信息
   * @param id 要查询的用户id, 省略时, 查询当前用户的详细信息
   */
  getUserById (id?: string): Observable<ResponseJSONModel<UserInfo>> {
    if (!id) {
      id = this.currentUser.id;
    }
    return this.http.get<ResponseJSONModel<UserInfo>>(`${this.urlUser}/${id}`, { headers: this.headers});
  }
  /**
   * 根据id修改用户信息
   * @param params 新的用户信息
   * @param id 要修改的用户id, 省略时, 修改当前用户的详细信息
   */
  putUserById (params: UserInfo, id?: string): Observable<ResponseJSONModel<UserInfo>> {
    if (!id) {
      id = this.currentUser.id;
    }
    const auth = this.permissionAuthentication<UserInfo>(params.department.toString());
    if (auth.error) {
      return auth.message;
    }
    return this.http.put<ResponseJSONModel<UserInfo>>(`${this.urlUser}/${id}`, params, { headers: this.headers});
  }

  /**
   * 根据id删除用户
   * @param id 要修改的用户id
   */
  deleteUserById (id?: string): Observable<ResponseJSONModel<UserInfo>> {
    return this.http.delete<ResponseJSONModel<UserInfo>>(`${this.urlUser}/${id}`, { headers: this.headers});
  }
  /**
   * 新增用户
   * @param params 新的用户信息
   */
  postUser (params: UserInfo): Observable<ResponseJSONModel<UserInfo>> {
    const auth = this.permissionAuthentication<UserInfo>(params.department.toString());
    if (auth.error) {
      return auth.message;
    }
    return this.http.post<ResponseJSONModel<UserInfo>>(`${this.urlUser}`, params, { headers: this.headers});
  }
  /**
   * 修改密码, 修改本人密码时必须提供旧密码, 修改下级密码时, 只需要提供新密码
   * @param params 旧密码和新密码
   * @param id 要修改密码的用户id
   */
  modifyPW (params: {newPassword: string, oldPassword?: string}, id?: string): Observable<ResponseJSONModel<null>> {
    const byId = id ? `/${id}` : '';
    return this.http.post<ResponseJSONModel<null>>(`${this.urlUser}/modifyPW${byId}`, params, { headers: this.headers});
  }
}
