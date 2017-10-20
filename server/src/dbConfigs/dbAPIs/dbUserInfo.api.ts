import { IUserInfoModel, IUserInfo, UserInfo } from '../../interface/IuserInfo';
import { IDBBaseAPI } from './dbBase.api';
import { UserInfoModel } from '../db.configs';

export class DBUseInfoAPI implements IDBBaseAPI<IUserInfoModel> {
  public _model = UserInfoModel;
  constructor() {}
  /**
   * 用户登陆
   * @param body 账号和密码
   */
  async login({loginName, password}: {loginName: string, password: string}): Promise<UserInfo> {
    const user = await this.getUserByLoginName(loginName);
    if (!user) {
      throw new Error('没有找到该账号');
    }
    const isMatch = await user.compirePassword(password, user.password);
    if (isMatch) {
      if (user.status === 0) {
        throw new Error('该账号已被禁用, 请联系管理员! ');
      }
      return new UserInfo(user);
    }
    else {
      throw new Error('密码输入错误');
    }
  }
  /**
   * 获取用户列表
   * @param departmentId: 根据用户所在部门进行筛选, 默认为空, 获取所有用户列表
   */
  async getUserList(level: number, departmentId: string = ''): Promise<UserInfo[]> {
    const param: {department?: string, level } = {
      level: {$gte: level}
    };
    if (departmentId) {
      param.department = departmentId;
    }
    const list: IUserInfoModel[] = await this._model.find(param);
    const userList: UserInfo[] = list.map((item) => {
      return new UserInfo( item );
    });
    return userList;
  }
  /**
   * 根据id查找用户[返回 IUserInfoModel]
   * @param id 要查找的id
   */
  async getUserModelById( id: string, needModle: boolean = false ): Promise<IUserInfoModel> {
    return await this._model.findOne({_id: id});
  }
  /**
   * 根据id查找用户[返回UserInfo]
   * @param id 要查找的id
   */
  async getUserById( id: string ): Promise<UserInfo> {
    const user = await this.getUserModelById(id);
    return user ? new UserInfo(user) : null;
  }
  /**
   * 根据登录名获取账户
   * @param loginName 登录名
   */
  async getUserByLoginName( loginName: string ): Promise<IUserInfoModel> {
    return await this._model.findOne({ loginName }).populate({
      path: 'deparment',
      select: '_id name',
      model: 'departments'
    }).exec();
  }
  /**
   * 新增用户
   */
  async addUser (body: IUserInfo): Promise<UserInfo> {
    const user = new UserInfoModel(body);
    const error = user.validateSync();
    if (error) {
      throw error;
    }
    const userM: IUserInfoModel = await user.save();
    if (userM) {
      return new UserInfo(userM);
    }
    return null;
  }
  /**
   * 根据ID更新用户信息
   * @param id 要更新的账户id
   * @param body 更新后的用户信息
   */
  async updateUserById (id: string, body: IUserInfo): Promise<UserInfo> {
    const params = {updateDate: new Date()};
    for (const key of Object.keys(body)) {
      if (key !== 'loginName') {
        params[key] = body[key];
      }
    }
    const user: IUserInfoModel = await this._model
        .findByIdAndUpdate(id, params)
        .select('_id loginName nickname')
        .exec();
    if (!user) {
      return null;
    }
    else {
      return new UserInfo(user);
    }
  }
  /**
   * 根据ID删除用户
   * @param id 要删除的账户id
   */
  async deleteUserById (id: string): Promise<UserInfo> {
    const user: IUserInfoModel = await this._model.findByIdAndRemove(id).select('_id loginName nickname').exec();
    if (!user) {
      return null;
    }
    return new UserInfo(user);
  }
}
