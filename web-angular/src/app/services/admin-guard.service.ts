import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router } from '@angular/router';
import {LoginService} from './login.service';

@Injectable()
export class AdminGuardService implements CanActivate, CanActivateChild {
  constructor(private loginSerVice: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLevel();
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLevel();
  }
  checkLevel(): boolean {
    if (this.loginSerVice.userInfo.level < 2) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}

