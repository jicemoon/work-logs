import { UserInfo, IUserInfo, IUserInfoModel } from './../interface/IuserInfo';
import { Request, Response, NextFunction } from 'express';
import { ResponseJSONModel } from './responseJson.model';
import { BaseAPIRoute } from './baseApi.route';
import { DBUseInfoAPI } from '../dbConfigs/dbAPIs/dbUserInfo.api';
import * as jwt from 'jsonwebtoken';
import { CONST_PARAMS } from '../configs/main';

export class UserInfoAPIRouter extends BaseAPIRoute<UserInfo, DBUseInfoAPI> {
  constructor (passport: any) {
    super(passport, '');
    this._dbAPI = new DBUseInfoAPI();
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<UserInfo>> {
    const user: UserInfo = await this._dbAPI.login(req.body);
    const resJSON = new ResponseJSONModel<UserInfo> ({
      isLogin: true,
      status: true,
      data: user,
      message: '登陆成功'
    });
    if (user) {
      const obj = {}, keys = Object.keys(user);
      for (const key of keys) {
        if ( key !== 'department' &&  user[key]) {
          obj[key] = user[key];
        }
      }
      user.token = jwt.sign(obj, CONST_PARAMS.JWT_SECRET_OR_KEY, {
        expiresIn: CONST_PARAMS.JWT_EXPIRES_IN
      });
    }
    return resJSON;
  }
  /**
   * 获取用户列表 *** 暂未做权限验证 ***
   */
  async getDatas(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<UserInfo[]>> {
    const currentUser: IUserInfoModel = req.user;
    const departId: string = req.query.departmentId;
    const users: UserInfo[] = await this._dbAPI.getUserList(currentUser.level, departId);
    const resJSON = new ResponseJSONModel<UserInfo[]> ({
      status: true,
      data: users
    });
    return resJSON;
  }
  /**
   * 根据ID获取用户信息
   */
  async getData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<UserInfo>> {
    const currentUser: IUserInfoModel = req.user;
    const id = req.params.id || currentUser.id;
    const isSelf = id === currentUser.id; //是否为自己
    const user: UserInfo = await this._dbAPI.getUserById(id);
    const resJSON = new ResponseJSONModel<UserInfo>({
      isLogin: true,
      status: !!user,
      data: user
    });
    resJSON.message = !!user ? '获取用户信息成功' : '获取用户信息失败, 没有找到该用户信息';
    return resJSON;
  }
  /**
   * 添加账户
   */
  async postData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<UserInfo>> {
    const currentUser: IUserInfoModel = req.user;
    const body: IUserInfo = req.body;
    const resJSON = new ResponseJSONModel<UserInfo>({
      isLogin: true,
      status: false,
      data: null
    });
    switch (true) {
      case !body.loginName:
        resJSON.message = '账号不能为空';
        break;
      case !body.password:
        resJSON.message = '密码不能为空';
        break;
      case (currentUser.level === 1 && currentUser.department !== body.department):
        resJSON.message = '该用户只有添加本部门账号的权限';
        break;
      case (currentUser.level === 1 && !body.department):
        body.department = currentUser.department;
        break;
      case (currentUser.level === 2):
        resJSON.message = '该用户没有新增账号的权限';
        break;
    }
    if (!resJSON.message) {
      try {
        const user: UserInfo = await this._dbAPI.addUser(body);
        resJSON.message = !!user ? '添加用户成功' : '添加用户失败';
        resJSON.data = user;
        resJSON.status = !!user;
      } catch (e) {
        if (e.message.indexOf('duplicate key error') !== -1) {
          resJSON.message = '已有相同的账号, 请更换后重新提交';
        }
        else {
          throw e;
        }
      }
    }
    return resJSON;
  }
  /**
   * 根据id更新账户信息
   */
  async updateData (req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<UserInfo>> {
    const currentUser: IUserInfoModel = req.user;
    const id = req.params.id || currentUser.id;
    const isSelf = id === currentUser.id; //是否为修改自己的信息
    const body: IUserInfo = req.body;
    const resJSON = new ResponseJSONModel<UserInfo> ({
      isLogin: true,
      status: false
    });
    let userModel = currentUser, isMatch = true;
    if (!isSelf) {
      //如果是上级, 首先根据id查找到该用户, 判断当前登录账号权限
      userModel = await this._dbAPI.getUserModelById(id);
      isMatch = false;
      if (!userModel) {
        resJSON.message = '修改失败, 没有找到该用户';
      } else if (currentUser.level === 0 || (currentUser.level === 1 && currentUser.level < userModel.level && currentUser.department !== userModel.department)) {
        isMatch = true;
      } else {
        resJSON.message = '你没有修改此账户信息的权限! ';
      }
    }
    if (isMatch) {
      if (body.password) {
        body.password = userModel.turnPassword(body.password);
      }
      const user = await this._dbAPI.updateUserById(id, body);
      resJSON.status = !!user;
      if (resJSON.status) {
        resJSON.message = '更新成功';
      } else {
        resJSON.message = '没有找到该账号';
      }
    }
    return resJSON;
  }
  /**
   * 根据ID删除用户
   */
  async deleteData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<UserInfo>> {
    const currentUser: IUserInfoModel = req.user;
    const id = req.params.id;
    const user = await this._dbAPI.deleteUserById (id);
    const resJSON = new ResponseJSONModel<UserInfo>({
      isLogin: true,
      status: !!user,
      data: user
    });
    resJSON.message = !!user ? '删除用户成功' : '删除用户失败, 没有找到该用户的信息';
    return resJSON;
  }
  /**
   * 修改密码, 修改下级或自己的密码[需要提供旧密码]
   */
  async modifyPW(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<UserInfo>> {
    const currentUser: IUserInfoModel = req.user;
    const id = req.params.id || currentUser.id;
    const isSelf = id === currentUser.id; //是否为修改自己的密码
    const  {oldPassword, newPassword} = req.body;
    const resJSON = new ResponseJSONModel<UserInfo>({
      isLogin: true,
      status: false
    });
    let user = null, isMatch = false, userModel: IUserInfoModel;
    if (isSelf) {
      //如果是自己, 比较验证旧密码是否正确
      userModel = currentUser;
      isMatch = await userModel.compirePassword(oldPassword, userModel.password);
    }
    else {
      //如果是上级, 首先根据id查找到该用户, 判断当前登录账号权限
      userModel = await this._dbAPI.getUserModelById(id);
      if (!userModel) {
        resJSON.message = '密码修改失败, 没有找到该用户';
      } else if (currentUser.level === 0 || (currentUser.level === 1 && currentUser.level < userModel.level && currentUser.department !== userModel.department)) {
        isMatch = true;
      } else {
        resJSON.message = '你没有修改此账户密码的权限! ';
      }
    }
    if (isMatch) {
      const hash = userModel.turnPassword(newPassword);
      user = await this._dbAPI.updateUserById(id, { password: hash });
      resJSON.message = !!user ? '密码修改成功' : '密码修改失败, 没有找到该用户的信息';
    }
    else {
      resJSON.message = '旧密码输入不正确, 请确认后重新修改';
    }
    resJSON.status = !!user;
    return resJSON;
  }
  initRouter() {
    super.initRouter();
    ///修改下级账户密码
    this.router.post(`${this.root}/modifyPW/:id`, this.passportAuthenticate, this.checkingRouteError(this.modifyPW));
    ///修改本人账户密码
    this.router.post(`${this.root}/modifyPW`, this.passportAuthenticate, this.checkingRouteError(this.modifyPW));
    this.router.put(`${this.root}`, this.passportAuthenticate, this.checkingRouteError(this.updateData));
    this.router.post(`${this.root}/login`, this.checkingRouteError(this.login));
  }
}
