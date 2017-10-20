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
const responseJson_model_1 = require("./responseJson.model");
const baseApi_route_1 = require("./baseApi.route");
const dbUserInfo_api_1 = require("../dbConfigs/dbAPIs/dbUserInfo.api");
const jwt = require("jsonwebtoken");
const main_1 = require("../configs/main");
class UserInfoAPIRouter extends baseApi_route_1.BaseAPIRoute {
    constructor(passport) {
        super(passport, '');
        this._dbAPI = new dbUserInfo_api_1.DBUseInfoAPI();
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._dbAPI.login(req.body);
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: true,
                data: user,
                message: '登陆成功'
            });
            if (user) {
                const obj = {}, keys = Object.keys(user);
                for (const key of keys) {
                    if (key !== 'department' && user[key]) {
                        obj[key] = user[key];
                    }
                }
                user.token = jwt.sign(obj, main_1.CONST_PARAMS.JWT_SECRET_OR_KEY, {
                    expiresIn: main_1.CONST_PARAMS.JWT_EXPIRES_IN
                });
            }
            return resJSON;
        });
    }
    /**
     * 获取用户列表 *** 暂未做权限验证 ***
     */
    getDatas(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const departId = req.query.departmentId;
            const users = yield this._dbAPI.getUserList(currentUser.level, departId);
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                status: true,
                data: users
            });
            return resJSON;
        });
    }
    /**
     * 根据ID获取用户信息
     */
    getData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const id = req.params.id || currentUser.id;
            const isSelf = id === currentUser.id; //是否为自己
            const user = yield this._dbAPI.getUserById(id);
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: !!user,
                data: user
            });
            resJSON.message = !!user ? '获取用户信息成功' : '获取用户信息失败, 没有找到该用户信息';
            return resJSON;
        });
    }
    /**
     * 添加账户
     */
    postData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const body = req.body;
            const resJSON = new responseJson_model_1.ResponseJSONModel({
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
                    const user = yield this._dbAPI.addUser(body);
                    resJSON.message = !!user ? '添加用户成功' : '添加用户失败';
                    resJSON.data = user;
                    resJSON.status = !!user;
                }
                catch (e) {
                    if (e.message.indexOf('duplicate key error') !== -1) {
                        resJSON.message = '已有相同的账号, 请更换后重新提交';
                    }
                    else {
                        throw e;
                    }
                }
            }
            return resJSON;
        });
    }
    /**
     * 根据id更新账户信息
     */
    updateData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const id = req.params.id || currentUser.id;
            const isSelf = id === currentUser.id; //是否为修改自己的信息
            const body = req.body;
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false
            });
            let userModel = currentUser, isMatch = true;
            if (!isSelf) {
                //如果是上级, 首先根据id查找到该用户, 判断当前登录账号权限
                userModel = yield this._dbAPI.getUserModelById(id);
                isMatch = false;
                if (!userModel) {
                    resJSON.message = '修改失败, 没有找到该用户';
                }
                else if (currentUser.level === 0 || (currentUser.level === 1 && currentUser.level < userModel.level && currentUser.department !== userModel.department)) {
                    isMatch = true;
                }
                else {
                    resJSON.message = '你没有修改此账户信息的权限! ';
                }
            }
            if (isMatch) {
                if (body.password) {
                    body.password = userModel.turnPassword(body.password);
                }
                const user = yield this._dbAPI.updateUserById(id, body);
                resJSON.status = !!user;
                if (resJSON.status) {
                    resJSON.message = '更新成功';
                }
                else {
                    resJSON.message = '没有找到该账号';
                }
            }
            return resJSON;
        });
    }
    /**
     * 根据ID删除用户
     */
    deleteData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const id = req.params.id;
            const user = yield this._dbAPI.deleteUserById(id);
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: !!user,
                data: user
            });
            resJSON.message = !!user ? '删除用户成功' : '删除用户失败, 没有找到该用户的信息';
            return resJSON;
        });
    }
    /**
     * 修改密码, 修改下级或自己的密码[需要提供旧密码]
     */
    modifyPW(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const id = req.params.id || currentUser.id;
            const isSelf = id === currentUser.id; //是否为修改自己的密码
            const { oldPassword, newPassword } = req.body;
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false
            });
            let user = null, isMatch = false, userModel;
            if (isSelf) {
                //如果是自己, 比较验证旧密码是否正确
                userModel = currentUser;
                isMatch = yield userModel.compirePassword(oldPassword, userModel.password);
            }
            else {
                //如果是上级, 首先根据id查找到该用户, 判断当前登录账号权限
                userModel = yield this._dbAPI.getUserModelById(id);
                if (!userModel) {
                    resJSON.message = '密码修改失败, 没有找到该用户';
                }
                else if (currentUser.level === 0 || (currentUser.level === 1 && currentUser.level < userModel.level && currentUser.department !== userModel.department)) {
                    isMatch = true;
                }
                else {
                    resJSON.message = '你没有修改此账户密码的权限! ';
                }
            }
            if (isMatch) {
                const hash = userModel.turnPassword(newPassword);
                user = yield this._dbAPI.updateUserById(id, { password: hash });
                resJSON.message = !!user ? '密码修改成功' : '密码修改失败, 没有找到该用户的信息';
            }
            else {
                resJSON.message = '旧密码输入不正确, 请确认后重新修改';
            }
            resJSON.status = !!user;
            return resJSON;
        });
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
exports.UserInfoAPIRouter = UserInfoAPIRouter;
//# sourceMappingURL=userInfo.route.js.map