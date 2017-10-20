import { ConfirmDialogComponent } from './../../shared/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { LoginService } from './../../../services/login.service';
import { UserService } from '../../../services/user.service';
import { UserInfo, Department } from './../../../models/responseJson.model';
import { AlertComponent, AlertTypes } from './../../shared/alert/alert.component';

const INFO_KEYS = ['nickname', 'title', 'email', 'avatar'];
@Component({
  selector: 'app-user-infos',
  templateUrl: './user-infos.component.html',
  styleUrls: ['./user-infos.component.scss']
})
export class UserInfosComponent implements OnInit {
  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;

  userInfo: UserInfo;
  cachUserInfo: UserInfo;
  infoForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private loginService: LoginService, private fb: FormBuilder, private userService: UserService) {
    this.userInfo = this.loginService.userInfo;
    this.createForm();
  }
  createForm() {
    this.infoForm = this.fb.group({
      loginName: [''],
      nickname: [''],
      level: [''],
      department: [''],
      title: [''],
      email: [''],
      avatar: ['']
    });
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(6), this.regExpValidator(/(\s+)|(^[0-9]+$)|(^[a-z]+$)/i)]],
      rePassword: ['', [Validators.required, this.reRepasswordValidator()]]
    });
  }
  ngOnInit() {
    this.getUserInfo();
  }
  getUserInfo() {
    this.userService.getUserById().subscribe((json) => {
      if (json.status) {
        this.cachUserInfo = json.data;
        this.resetInput();
      } else {
        this.myAlert.showAlert('操作失败', json.message, AlertTypes.danger);
      }
    });
  }
  resetInput() {
    if (!this.cachUserInfo) {
      this.getUserInfo();
      return;
    }
    this.infoForm.controls['loginName'].setValue(this.cachUserInfo.loginName);
    this.infoForm.controls['nickname'].setValue(this.cachUserInfo.nickname);
    this.infoForm.controls['level'].setValue(['超级管理员', '管理员', '员工'][this.cachUserInfo.level === undefined ? 2 : this.cachUserInfo.level]);
    this.infoForm.controls['department'].setValue((this.cachUserInfo.department as Department) ? (this.cachUserInfo.department as Department).name : '');
    this.infoForm.controls['title'].setValue(this.cachUserInfo.title);
    this.infoForm.controls['email'].setValue(this.cachUserInfo.email);
    this.infoForm.controls['avatar'].setValue(this.cachUserInfo.avatar);
  }
  submit(evt: Event) {
    evt.preventDefault();
    const user = {};
    INFO_KEYS.forEach(key => {
      const value = this.infoForm.controls[key].value;
      if (value) {
        user[key] = value;
      }
    });
    this.userService.putUserById(user).subscribe(json => {
      if (!this.loginService.logoutDialogGuard(this.myDialog, json)) {
        return;
      }
      this.myAlert.showAlert('', json.message, json.status ? AlertTypes.success : AlertTypes.danger);
    });
  }
  modifyPW(evt: Event) {
    evt.preventDefault();
    const oldPassword = this.passwordForm.controls['oldPassword'].value;
    const newPassword = this.passwordForm.controls['newPassword'].value;
    this.userService.modifyPW({ oldPassword, newPassword }).subscribe(json => {
      if (!this.loginService.logoutDialogGuard(this.myDialog, json)) {
        return;
      }
      let message = json.message;
      if (json.status) {
        message += ', 两秒后跳转到登录页面!';
        setTimeout(() => {
          this.loginService.logout();
        }, 2000);
      }
      this.myAlert.showAlert('', message, json.status ? AlertTypes.success : AlertTypes.danger);
    });
  }

  inputInvalid(name) {
    const ac: AbstractControl = this.passwordForm.get(name);
    if (!ac) {
      return false;
    }
    let temp = false;
    if (name === 'rePassword') {
      temp = ac.value !== this.passwordForm.get('newPassword').value;
    }
    else if (name === 'newPassword') {
      temp = ac.value === this.passwordForm.get('oldPassword').value;
    }
    return (temp || ac.invalid) && (ac.dirty || ac.touched);
  }
  regExpValidator(reg: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = reg.test(control.value);
      return forbidden ? { 'regExp': { value: control.value } } : null;
    };
  }
  reRepasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return '' === control.value ? { 'rePassword': { value: control.value } } : null;
    };
  }
}
