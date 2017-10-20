import { CONST_PARAMS } from './../configs/main';
import { IUserInfo } from './IuserInfo';
import { Document } from 'mongoose';

import { IBase } from './Ibase';
import { IDepartmentModel, Department } from './Idepartment';

/**账号性别*/
export enum UserGender {
  disabled = 0,   //禁用
  enabled = 1  //启用
}
/**账号状态*/
export enum UserStatus {
  male = 0,
  female = 1
}
/**账号权限*/
export enum UserLevel {
  admin = 0,
  manager = 1,
  member = 2
}
export interface IUserInfo extends IBase {
  /**登录帐号*/
  loginName?: string;
  /**账号状态*/
  status?: UserStatus;
  email?: string;
  /**登陆密码*/
  password?: string;
  /**账号权限*/
  level?: UserLevel;
  /**昵称*/
  nickname?: string;
  /**职称*/
  title?: string;
  /**头像地址或base64图片*/
  avatar?: string;
  /** 性别 */
  gender?: UserGender;
  /** 所在部门 */
  department?: IDepartmentModel;
  /** 出生日期 */
  birthday?: Date;
  token?: string;
}
export class UserInfo {
  id?: string;
  /**登录帐号*/
  loginName?: string;
  status?: UserStatus;
  email?: string;
  /**登陆密码*/
  password?: string;
  /**账号权限*/
  level?: UserLevel;
  nickname?: string;
  /**职称*/
  title?: string;
  /**头像地址或base64图片*/
  avatar?: string;
  /** 性别 */
  gender?: UserGender;
  /** 所在部门, 当作为新增或者修改参数时, 此参数为所在部门id, 字符串类型 */
  department?: Department;
  /** 出生日期 */
  birthday?: string;
  token?: string;
  updateDate?: string;
  createDate?: string;
  constructor ( user: IUserInfoModel | string, needPassword: boolean = false) {
    if (typeof user === 'string') {
      this.id = user;
    }
    else if (user) {
      this.id = user.id || user._id.toString();
      this.loginName = user.loginName;
      this.status = user.status;
      this.email = user.email;
      if (needPassword) {
        this.password = user.password;
      }
      this.level = user.level;
      this.nickname = user.nickname || user.loginName;
      this.title = user.title;
      this.avatar = user.avatar;
      this.gender = user.gender;
      if (user.department) {
        this.department = new Department(user.department);
      }
      if (user.birthday) {
        (this.birthday = (new Date(user.birthday)).format(CONST_PARAMS.FORMAT_DATE));
      }
      this.updateDate = user.updateDate && (new Date(user.updateDate)).format(CONST_PARAMS.FORMAT_DATE_TIME);
      this.createDate = user.createDate && (new Date(user.createDate)).format(CONST_PARAMS.FORMAT_DATE_TIME);
    }
  }
}
export interface IUserInfoModel extends IUserInfo, Document {
  /**
   * @params
   */
  compirePassword(pw: string, hash: string): Promise<boolean>;
  /**
   * 将密码转为密文
   */
  turnPassword(pw: string): string;
}
