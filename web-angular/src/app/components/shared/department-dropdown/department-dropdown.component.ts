import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { LoginService } from './../../../services/login.service';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DepartmentService } from './../../../services/department.service';
import { Department } from '../../../models/responseJson.model';
import { AlertComponent, AlertTypes } from './../../shared/alert/alert.component';

@Component({
  selector: 'app-department-dropdown',
  templateUrl: './department-dropdown.component.html',
  styleUrls: ['./department-dropdown.component.scss']
})
export class DepartmentDropdownComponent implements OnInit {
  @Output() onDepartmentChanged = new EventEmitter<Department>();
  @ViewChild('myAlert') myAlert: AlertComponent;
  @ViewChild('myDialog') myDialog: ConfirmDialogComponent;

  currentDepartment: Department;
  departmentList: Department[] = [{ id: '0', name: '所有部门' }];

  constructor(private departmentService: DepartmentService, private loginService: LoginService) {
    this.currentDepartment = this.departmentList[0];
  }
  ngOnInit() {
    this.getDepartmentList();
    this.onDepartmentChanged.emit(this.currentDepartment);
  }

  getDepartmentList() {
    this.departmentService.getDepargments().subscribe((json) => {
      if (!this.loginService.logoutDialogGuard(this.myDialog, json)) {
        return;
      }
      if (json.status) {
        this.departmentList = [this.departmentList[0], ...json.data];
      } else {
        this.myAlert.showAlert('获取部门列表失败', json.message, AlertTypes.danger);
      }
    });
  }
  dropdownClickHandle(item: Department) {
    if (item.id !== this.currentDepartment.id) {
      this.currentDepartment = item;
      this.onDepartmentChanged.emit(item);
    }
  }
}
