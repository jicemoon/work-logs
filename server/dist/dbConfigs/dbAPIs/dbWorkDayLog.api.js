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
const IworkDayLog_1 = require("./../../interface/IworkDayLog");
const db_configs_1 = require("../db.configs");
const responseJson_model_1 = require("../../routes/responseJson.model");
class DBWorkDayLogAPI {
    constructor() {
        this._model = db_configs_1.WorkDayLogsModel;
    }
    /**
     * 批量获取日志列表
     */
    getWorkDayLogList(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (searchParams.userId) {
                params.user = searchParams.userId;
            }
            if (searchParams.departmentId) {
                const users = yield db_configs_1.UserInfoModel.find({ department: searchParams.departmentId }).select('_id');
                params.user = { $in: users };
            }
            if (searchParams.date) {
                const startParams = new Date(searchParams.date);
                const start = new Date(startParams.getFullYear(), startParams.getMonth(), startParams.getDate());
                let end, endParams;
                if (searchParams.endDate) {
                    endParams = new Date(searchParams.endDate);
                    endParams = new Date(endParams.getFullYear(), endParams.getMonth(), endParams.getDate());
                }
                else {
                    endParams = start;
                }
                end = new Date(endParams.getTime() + 24 * 3600 * 1000);
                params.date = { '$gte': start, '$lt': end };
            }
            searchParams.pageIndex = searchParams.pageIndex || 1;
            searchParams.pageSize = searchParams.pageSize || 20;
            const query = this._model.find(params).sort({ _id: -1 });
            const total = yield this._model.count(query);
            const list = yield query.skip(searchParams.pageSize * (searchParams.pageIndex - 1)).limit(searchParams.pageSize).exec();
            const wdlList = list.map(item => {
                return new IworkDayLog_1.WorkDayLog(item);
            });
            const pageData = {
                pageSize: searchParams.pageSize,
                pageIndex: searchParams.pageIndex,
                total
            };
            return new responseJson_model_1.ResponsePagingJSON(pageData, wdlList);
        });
    }
    /**
     * 根据ID获取单个日志
     */
    getWorkDayLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const wdl = yield this._model.findOne({ _id: id });
            return wdl ? new IworkDayLog_1.WorkDayLog(wdl) : null;
        });
    }
    /**
     * 根据用户和日期获取日志
     * @param userId
     * @param date
     */
    getWorkDayLogByUserAndDate(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._model.findOne({ date, user: userId });
        });
    }
    /**
     * 新增日志
     */
    addWorkDayLog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let wdl = new db_configs_1.WorkDayLogsModel(body);
            const error = wdl.validateSync();
            if (error) {
                throw error;
            }
            wdl = yield wdl.save();
            return wdl ? new IworkDayLog_1.WorkDayLog(wdl, false) : null;
        });
    }
    /**
     * 根据ID更新日志
     */
    updateWorkDayLogById(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            body.updateDate = new Date();
            const wdl = yield this._model.findByIdAndUpdate(id, body).select('_id');
            return wdl ? new IworkDayLog_1.WorkDayLog(wdl) : null;
        });
    }
    /**
     * 根据ID删除日志
     */
    deleteWorkDayLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const wdl = yield this._model.findByIdAndRemove(id);
            return wdl ? new IworkDayLog_1.WorkDayLog(wdl) : null;
        });
    }
}
exports.DBWorkDayLogAPI = DBWorkDayLogAPI;
//# sourceMappingURL=dbWorkDayLog.api.js.map