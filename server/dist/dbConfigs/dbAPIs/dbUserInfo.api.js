"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const IuserInfo_1 = require("../../interface/IuserInfo");
const db_configs_1 = require("../db.configs");
class DBUseInfoAPI {
    constructor() {
        this._model = db_configs_1.UserInfoModel;
    }
    /**
     * 用户登陆
     * @param body 账号和密码
     */
    login({ loginName, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserByLoginName(loginName);
            if (!user) {
                throw new Error('没有找到该账号');
            }
            const isMatch = yield user.compirePassword(password, user.password);
            if (isMatch) {
                if (user.status === 0) {
                    throw new Error('该账号已被禁用, 请联系管理员! ');
                }
                return new IuserInfo_1.UserInfo(user);
            }
            else {
                throw new Error('密码输入错误');
            }
        });
    }
    /**
     * 获取用户列表
     * @param departmentId: 根据用户所在部门进行筛选, 默认为空, 获取所有用户列表
     */
    getUserList(level, departmentId = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const param = {
                level: { $gte: level }
            };
            if (departmentId) {
                param.department = departmentId;
            }
            const list = yield this._model.find(param);
            const userList = list.map((item) => {
                return new IuserInfo_1.UserInfo(item);
            });
            return userList;
        });
    }
    /**
     * 根据id查找用户[返回 IUserInfoModel]
     * @param id 要查找的id
     */
    getUserModelById(id, needModle = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.findOne({ _id: id });
        });
    }
    /**
     * 根据id查找用户[返回UserInfo]
     * @param id 要查找的id
     */
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserModelById(id);
            return user ? new IuserInfo_1.UserInfo(user) : null;
        });
    }
    /**
     * 根据登录名获取账户
     * @param loginName 登录名
     */
    getUserByLoginName(loginName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.findOne({ loginName }).populate({
                path: 'deparment',
                select: '_id name',
                model: 'departments'
            }).exec();
        });
    }
    /**
     * 新增用户
     */
    addUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new db_configs_1.UserInfoModel(body);
            const error = user.validateSync();
            if (error) {
                throw error;
            }
            const userM = yield user.save();
            if (userM) {
                return new IuserInfo_1.UserInfo(userM);
            }
            return null;
        });
    }
    /**
     * 根据ID更新用户信息
     * @param id 要更新的账户id
     * @param body 更新后的用户信息
     */
    updateUserById(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { updateDate: new Date() };
            for (const key of Object.keys(body)) {
                if (key !== 'loginName') {
                    params[key] = body[key];
                }
            }
            const user = yield this._model
                .findByIdAndUpdate(id, params)
                .select('_id loginName nickname')
                .exec();
            if (!user) {
                return null;
            }
            else {
                return new IuserInfo_1.UserInfo(user);
            }
        });
    }
    /**
     * 根据ID删除用户
     * @param id 要删除的账户id
     */
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._model.findByIdAndRemove(id).select('_id loginName nickname').exec();
            if (!user) {
                return null;
            }
            return new IuserInfo_1.UserInfo(user);
        });
    }
}
exports.DBUseInfoAPI = DBUseInfoAPI;
//# sourceMappingURL=dbUserInfo.api.js.map