import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Department, ResponseJSONModel, UserInfo } from '../../../models/responseJson.model';
import { DepartmentService } from '../../../services/department.service';
import { LoginService } from '../../../services/login.service';
import { UserService } from '../../../services/user.service';
import { AlertComponent, AlertTypes } from '../../shared/alert/alert.component';
import {
    ConfirDialogOptions, ConfirmDialogComponent
} from '../../shared/confirm-dialog/confirm-dialog.component';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('editOrAddUserModal') editOrAddUserModal: ModalComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;
  userLevels = ['超级管理员', '管理员', '员工'];
  userStatus = ['禁用', '启用'];
  isEdit = false;
  userList: UserInfo[] = [];
  currentUser: UserInfo;
  currentEdit: UserInfo;
  userInfoForm: FormGroup;
  currentDepartment: Department;
  departmentList: Department[];
  levelList: {id: number, name: string}[] = [];

  constructor(private userService: UserService, private loginService: LoginService, private fb: FormBuilder, private departmentService: DepartmentService) {
    this.currentUser = this.loginService.userInfo;
  }

  ngOnInit() {
    this.getDepartmentList();
    if (this.currentUser.level > 0) {
      this.getUserList(this.currentUser.department);
    }
    for (let i = this.currentUser.level; i < 3; i++) {
      this.levelList.push({
        id: i,
        name: this.userLevels[i]
      });
    }
    this.userInfoForm = this.fb.group({
      loginName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), this.regExpValidator(/^[a-z][a-z0-9_]{2,14}$/i, true)]],
      password: ['', [Validators.maxLength(16), this.regexpPasswordValidator(/(\s+)|(^[0-9]+$)|(^[a-z]+$)/i)]],
      level: [2],
      department: ['', [Validators.required]]
    });
  }
  getDepartmentList() {
    this.departmentService.getDepargments().subscribe((json) => {
      if (json.status) {
        this.departmentList = json.data;
      } else {
        this.myAlert.showAlert('获取部门列表失败', json.message, AlertTypes.danger);
      }
    });
  }
  getUserList(department?: Department) {
    if (department) {
      this.currentDepartment = department;
    }
    this.userService.getUsers(this.currentDepartment.id).subscribe((json: ResponseJSONModel<UserInfo[]>) => {
      if (json.status) {
        this.userList = json.data.filter(user => user.id !== this.currentUser.id);
      } else {
        this.myAlert.showAlert('获取用户列表失败', json.message, AlertTypes.danger);
      }
    });
  }
  addOrEditUser (user?: UserInfo) {
    this.isEdit = !!user;
    this.currentEdit = user;
    this.userInfoForm.controls['loginName'].setValue(user ? user.loginName : '');
    this.userInfoForm.controls['level'].setValue(user ? user.level : 2);
    this.userInfoForm.controls['department'].setValue(user ? user.department.id : '');
    this.userInfoForm.controls['password'].setValue('');
    this.editOrAddUserModal.openModal();
  }
  submitUserInfo(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    if (this.userInfoForm.invalid) {
      return;
    }
    let params: UserInfo;
    const loginName = this.userInfoForm.controls['loginName'].value;
    const level = this.userInfoForm.controls['level'].value;
    const departmentId = this.userInfoForm.controls['department'].value;
    const password = this.userInfoForm.controls['password'].value;
    let handle: Observable<ResponseJSONModel<UserInfo>>;
    if (this.isEdit) {
      let hasChange = false;
      params = {};
      if (this.currentEdit.level !== level) {
        params.level = level;
        hasChange = true;
      }
      if (this.currentEdit.department.id !== departmentId) {
        params.department = departmentId;
        hasChange = true;
      }
      if (password) {
        params.password = password;
        hasChange = true;
      }
      if (hasChange) {
        handle = this.userService.putUserById(params, this.currentEdit.id);
      } else {
        this.myAlert.showAlert('', '您没有修改任何内容', AlertTypes.warning);
        return;
      }
    }
    else {
      params = { loginName, level, department: departmentId, password};
      handle = this.userService.postUser(params);
    }
    handle.subscribe(json => {
      if (this.loginService.logoutDialogGuard(this.myDialog, json)) {
        if (json.status) {
          this.myAlert.showAlert('', json.message, AlertTypes.success);
          this.editOrAddUserModal.closeModal();
          this.getUserList();
        } else {
          this.myAlert.showAlert('', json.message, AlertTypes.danger);
        }
      }
    });
  }
  cancelSubmit(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    this.editOrAddUserModal.closeModal();
  }
  deleteUser(user: UserInfo) {
    this.myDialog.showDialog({
      content: `<span class="text-danger">您确定要删除用户(<strong>${user.nickname}</strong>)吗</span>`,
      okHandle: (): boolean => {
        this.userService.deleteUserById(user.id).subscribe((json) => {
          if (this.loginService.logoutDialogGuard(this.myDialog, json)) {
            if (json.status) {
              this.getUserList();
            }
            this.myAlert.showAlert('', json.message, json.status ?  AlertTypes.success : AlertTypes.danger);
          }
        });
        return true;
      }
    });
  }

  inputInvalid(name) {
    const ac: AbstractControl = this.userInfoForm.get(name);
    if (!ac) {
      return false;
    }
    return ac.invalid && (ac.dirty || ac.touched);
  }
  regexpPasswordValidator(reg: RegExp, isTrue: Boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let forbidden = reg.test(control.value);
      if (isTrue) {
        forbidden = !forbidden;
      }
      if (this.isEdit && control.value === '') {
        ///修改账户信息时, 密码可以为空
        forbidden = false;
      } else if (control.value.length < 6) {
        forbidden = true;
      }
      return forbidden ? { 'regExp': { value: control.value } } : null;
    };
  }
  regExpValidator(reg: RegExp, isTrue: Boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let forbidden = reg.test(control.value);
      if (isTrue) {
        forbidden = !forbidden;
      }
      return forbidden ? { 'regExp': { value: control.value } } : null;
    };
  }
}
