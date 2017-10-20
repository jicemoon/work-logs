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
const express_1 = require("express");
const main_1 = require("../configs/main");
class BaseAPIRoute {
    constructor(passport, root = '') {
        this.root = root ? ('/' + root) : '';
        this.passport = passport;
        this.router = express_1.Router();
        this.passportAuthenticate = this.passportAuthenticate.bind(this);
        this.initRouter();
    }
    /**
     * 批量获取数据
     */
    getDatas(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * 根据ID获取对应数据
     */
    getData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * 添加数据
     */
    postData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * 根据ID更新数据
     */
    updateData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * 根据ID删除数据
     */
    deleteData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * 将每一个Route处理函数, 包裹在try...catch中并返回;
     */
    checkingRouteError(routeHandler) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const resData = yield routeHandler.call(this, req, res, next);
                res.json(resData);
            }
            catch (err) {
                const messages = [];
                if (err.errors) {
                    const keys = Object.keys(err.errors);
                    for (const key of keys) {
                        messages.push(err.errors[key].message);
                    }
                }
                else {
                    messages.push(err.message);
                }
                res.json(new responseJson_model_1.ResponseJSONModel({
                    isLogin: true,
                    status: false,
                    message: messages.join(' && '),
                    data: null
                }));
            }
        });
    }
    passportAuthenticate(req, res, next) {
        this.passport.authenticate('jwt', { session: false }, (err, data, info) => {
            if (err) {
                next(err);
            }
            else if (data) {
                req.user = data;
                next();
            }
            else if (info) {
                let message = '';
                switch (true) {
                    case (info.name === 'TokenExpiredError'):
                        const expiredTime = (new Date(info.expiredAt)).format(main_1.CONST_PARAMS.FORMAT_DATE_TIME);
                        message = `登陆授权已过期(${expiredTime}), 请重新登陆已获取授权`;
                        break;
                    case (info.name === 'JsonWebTokenError' || /Unexpected\s+token/i.test(info.message)):
                        message = `无效的身份验证`;
                        break;
                    default:
                        message = '身份验证失败, 请重新登陆';
                }
                const resJSON = new responseJson_model_1.ResponseJSONModel({
                    isLogin: false,
                    status: false,
                    message
                });
                res.json(resJSON);
            }
        })(req, res, next);
    }
    initRouter() {
        this.router.get(`${this.root}/`, this.passportAuthenticate, this.checkingRouteError(this.getDatas));
        this.router.get(`${this.root}/:id`, this.passportAuthenticate, this.checkingRouteError(this.getData));
        this.router.post(`${this.root}/`, this.passportAuthenticate, this.checkingRouteError(this.postData));
        this.router.put(`${this.root}/:id`, this.passportAuthenticate, this.checkingRouteError(this.updateData));
        this.router.delete(`${this.root}/:id`, this.passportAuthenticate, this.checkingRouteError(this.deleteData));
    }
}
exports.BaseAPIRoute = BaseAPIRoute;
//# sourceMappingURL=baseApi.route.js.map