import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, state, style } from '@angular/animations';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  nickName: string;
  loginName: string;
  userLevel: number;
  displaySideMenu = false;
  constructor(private router: Router, private loginService: LoginService) {
    this.nickName = this.loginService.userInfo ? this.loginService.userInfo.nickname : 'Reese';
    this.loginName = this.loginService.userInfo ? this.loginService.userInfo.loginName : 'jicemoon';
    this.userLevel = this.loginService.userInfo ? this.loginService.userInfo.level : 2;
  }
  ///退出登陆
  logoutHandle() {
    this.loginService.logout();
  }
  openMenu() {
    this.displaySideMenu = true;
  }
  hideMenu() {
    this.displaySideMenu = false;
  }
}
