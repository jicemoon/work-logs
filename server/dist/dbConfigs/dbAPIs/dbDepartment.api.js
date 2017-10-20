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
const Idepartment_1 = require("./../../interface/Idepartment");
const db_configs_1 = require("../db.configs");
class DBDepartmentAPI {
    constructor() {
        this._model = db_configs_1.DepartmentModel;
    }
    /**
     * 查询所有的部门列表
     */
    getDepartmentList() {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this._model.find({}).exec();
            const departList = list.map((item) => {
                return new Idepartment_1.Department(item);
            });
            return departList;
        });
    }
    /**
     * 根据ID查找部门名称
     * @param id 部门id
     */
    getDepartmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const departModel = yield this._model.findOne({ _id: id }).exec();
            return new Idepartment_1.Department(departModel);
        });
    }
    /**
     * 新增部门
     */
    addDepartment(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const depart = new db_configs_1.DepartmentModel(body);
            const error = depart.validateSync();
            if (error) {
                throw error;
            }
            const departM = yield depart.save();
            if (departM) {
                return new Idepartment_1.Department(departM);
            }
            return null;
        });
    }
    /**
     * 根据ID更新部门信息
     * @param id 要更新的账户id
     * @param body 更新后的用户信息
     */
    updateDepartmentById(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            body.updateDate = new Date();
            const depart = yield this._model.findByIdAndUpdate(id, body).exec();
            if (!depart) {
                return null;
            }
            else {
                return new Idepartment_1.Department(depart);
            }
        });
    }
    /**
     * 根据ID删除用户
     * @param id 要删除的账户id
     */
    deleteDepartmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const depart = yield this._model.findByIdAndRemove(id).exec();
            if (!depart) {
                return null;
            }
            return new Idepartment_1.Department(depart);
        });
    }
}
exports.DBDepartmentAPI = DBDepartmentAPI;
//# sourceMappingURL=dbDepartment.api.js.map