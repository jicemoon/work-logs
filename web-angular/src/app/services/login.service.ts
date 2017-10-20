import { ConfirmDialogComponent } from './../components/shared/confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie';

import { URL_ROOT } from '../models/requestParams.model';
import { ResponseJSONModel, ResponsePagingJSON, UserInfo, Department } from './../models/responseJson.model';


@Injectable()
export class LoginService {
  isLoggedIn = false;
  userInfo: UserInfo;
  redirectUrl: string;

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    const userInfo: any = this.cookieService.getObject('loginToken');
    if (userInfo) {
      this.userInfo = {
        id: userInfo.i,
        loginName: userInfo.ln,
        nickname: userInfo.nn,
        token: userInfo.t,
        level: userInfo.l,
        department: userInfo.d,
        avatar: userInfo.a
      };
      this.isLoggedIn = true;
    }
  }

  login(data: { loginName, password }): Observable<ResponseJSONModel<UserInfo>> {
    return this.http.post<ResponseJSONModel<UserInfo>>(`${URL_ROOT}/user/login`, data).map((json) => {
      if (json.status) {
        this.isLoggedIn = true;
        this.userInfo = json.data;
        this.cookieService.putObject('loginToken', {
          i: this.userInfo.id,
          t: this.userInfo.token,
          ln: this.userInfo.loginName,
          nn: this.userInfo.nickname,
          l: this.userInfo.level,
          d: this.userInfo.department,
          a: this.userInfo.avatar
        });
      }
      return json;
    });
  }
  logoutDialogGuard(dialog: ConfirmDialogComponent, json: ResponseJSONModel<any>): Boolean {
    if (json.isLogin === false && dialog) {
      dialog.showDialog({
        title: '',
        showCloseBtn: false,
        content: `${json.message}, 请<strong>重新登陆</strong>`,
        cancelText: '',
        okText: '确定',
        okHandle: () => {
          this.logout();
          return true;
        }
      });
    }
    return json.isLogin;
  }
  logout() {
    this.cookieService.remove('loginToken');
    this.userInfo = null;
    this.isLoggedIn = false;
    // 跳转到登陆页面
    this.router.navigate(['/login']);
  }
}
