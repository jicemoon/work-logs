import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import { LoginService } from '../../../services/login.service';
import { AlertComponent, AlertTypes } from './../../shared/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  @ViewChild('myAlert') myAlert: AlertComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) {
    this.createLoginForm();
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      loginName: ['', [Validators.required, Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(6), this.regExpValidator(/(^[0-9]+$)|(^[a-z]+$)/i)]]
    });
  }
  login(evt) {
    if (this.loginForm.invalid) {
      return;
    }
    const loginName = this.loginForm.get('loginName').value;
    const password = this.loginForm.get('password').value;
    this.loginService.login({ loginName, password }).subscribe((data) => {
      if (data.status === true) {
        this.myAlert.showAlert('登陆成功', '2秒后跳转页面, 请稍候...', AlertTypes.success, 2000);
        setTimeout(() => {
          this.router.navigate([this.loginService.redirectUrl || '/']);
        }, 1000);
      }
      else {
        this.myAlert.showAlert('登陆失败', data.message, AlertTypes.danger);
      }
    });
  }
  ngOnInit() {
  }
  inputInvalid(name) {
    const ac: AbstractControl = this.loginForm.get(name);
    if (!ac) {
      return false;
    }
    return ac.invalid && (ac.dirty || ac.touched);
  }
  regExpValidator(reg: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = reg.test(control.value);
      return forbidden ? { 'regExp': { value: control.value } } : null;
    };
  }
}
