import { LoginService } from './../../../services/login.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentService } from './../../../services/department.service';
import { Department, ResponseJSONModel } from '../../../models/responseJson.model';

import { IDepartment } from './../../../models/requestParams.model';
import { AlertComponent, AlertTypes } from './../../shared/alert/alert.component';
import {
    ConfirDialogOptions, ConfirmDialogComponent
} from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;
  departmentList: Department[];
  currentEdit: Department;
  constructor(private departmentService: DepartmentService, private loginService: LoginService) { }

  ngOnInit() {
  this.getDepartmentList();
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
  /**
   * 删除部门
   */
  deleteDepartment(department: Department) {
    this.myDialog.showDialog({
      content: `<span class="text-danger">您确定要删除部门(<strong>${department.name}</strong>)吗</span>`,
      okHandle: (): boolean => {
        this.departmentService.deleteDepartmentById(department.id).subscribe((json) => {
          if (json.status) {
            this.removeFromList(department);
          }
          this.myAlert.showAlert('', json.message, json.status ?  AlertTypes.success : AlertTypes.danger);
        });
        return true;
      }
    });
  }
  /**
   * 新增部门
   */
  addDepartment() {
    if (this.currentEdit && !this.currentEdit.id) {
      this.myAlert.showAlert('', '请先保存或取消正在新增的部门后, 再进行此操作', AlertTypes.warning);
      return;
    }
    this.currentEdit = {
      id: '',
      name: ''
    };
    this.departmentList.push(this.currentEdit);
  }
  cancelEditOrAdd(department: Department) {
    if (!this.currentEdit.id) {
      this.removeFromList(this.currentEdit);
    }
    this.currentEdit = null;
  }
  removeFromList(department: Department) {
    for ( let i = this.departmentList.length - 1; i >= 0; i--) {
      if (this.departmentList[i].id === department.id) {
        this.departmentList.splice(i, 1);
        break;
      }
    }
  }
  saveEditOrAdd(department: Department) {
    const isEdit = !!this.currentEdit.id;
    if (!this.currentEdit.name) {
      this.myAlert.showAlert('', '请输入部门名称', AlertTypes.danger);
      return;
    }
    const params: IDepartment = {
      name: this.currentEdit.name
    };
    let handle: Observable<ResponseJSONModel<Department>>;
    if (isEdit) {
      handle = this.departmentService.putDepartment(params, this.currentEdit.id);
    }
    else {
      handle = this.departmentService.postDepartment(params);
    }
    handle.subscribe( json => {
      if (!this.loginService.logoutDialogGuard(this.myDialog, json)) {
        return;
      }
      if (json.status) {
        department.name = this.currentEdit.name;
        department.id = json.data.id;
        department.createDate = json.data.createDate;
        department.updateDate = json.data.updateDate;
        this.currentEdit = null;
      }
      this.myAlert.showAlert('', json.message, json.status ?  AlertTypes.success : AlertTypes.danger);
    });
  }
  /**
   * 修改部门名称
   */
  editDepartment(department: Department) {
    this.currentEdit = {
      id: department.id,
      name: department.name
    };
  }
}
