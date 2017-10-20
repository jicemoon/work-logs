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
const dbDepartment_api_1 = require("./../dbConfigs/dbAPIs/dbDepartment.api");
const responseJson_model_1 = require("./responseJson.model");
const baseApi_route_1 = require("./baseApi.route");
class DepartmentAPIRouter extends baseApi_route_1.BaseAPIRoute {
    constructor(passport) {
        super(passport);
        this._dbAPI = new dbDepartment_api_1.DBDepartmentAPI();
    }
    /**
     * 获取全部部门列表
     */
    getDatas(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const departments = yield this._dbAPI.getDepartmentList();
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: true,
                message: '获取成功',
                data: departments
            });
            return resJSON;
        });
    }
    /**
     * 根据ID获取对应数据
     */
    getData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false
            });
            if (!id) {
                resJSON.message = `请提供要查询部门的ID`;
            }
            else {
                const depart = yield this._dbAPI.getDepartmentById(id);
                resJSON.status = !!depart;
                resJSON.data = depart;
                resJSON.message = !!depart ? '查询成功' : '查询失败, 没有找到该部门的信息';
            }
            return resJSON;
        });
    }
    /**
     * 修改或添加部门
     */
    addOrModifyData(currentUser, body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEdit = !!id;
            const msgTitle = isEdit ? '修改' : '添加';
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false,
                data: null
            });
            if (!currentUser || currentUser.level !== 0) {
                resJSON.message = `您没有${msgTitle}部门信息的权限`;
            }
            else {
                try {
                    let depart;
                    if (isEdit) {
                        depart = yield this._dbAPI.updateDepartmentById(id, body);
                    }
                    else {
                        depart = yield this._dbAPI.addDepartment(body);
                    }
                    resJSON.message = !!depart ? `${msgTitle}部门成功` : `${msgTitle}部门失败`;
                    resJSON.data = depart;
                    resJSON.status = !!depart;
                }
                catch (e) {
                    if (e.message.indexOf('duplicate key error') !== -1) {
                        resJSON.message = '已有相同名称的部门';
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
     * 添加部门
     */
    postData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addOrModifyData(req.user, req.body);
        });
    }
    /**
     * 更新部门名称
     */
    updateData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addOrModifyData(req.user, req.body, req.params.id);
        });
    }
    /**
     * 根据ID删除部门
     */
    deleteData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const id = req.params.id;
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false
            });
            if (!id) {
                resJSON.message = `请提供要删除部门的ID`;
            }
            else if (!currentUser || currentUser.level !== 0) {
                resJSON.message = `您没有删除部门信息的权限`;
            }
            else {
                const depart = yield this._dbAPI.deleteDepartmentById(id);
                resJSON.status = !!depart;
                resJSON.message = !!depart ? '删除部门成功' : '删除部门失败, 没有找到该部门的信息';
            }
            return resJSON;
        });
    }
}
exports.DepartmentAPIRouter = DepartmentAPIRouter;
//# sourceMappingURL=department.route.js.map