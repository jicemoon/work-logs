"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseJson_model_1 = require("./responseJson.model");
const baseApi_route_1 = require("./baseApi.route");
const dbWorkDayLog_api_1 = require("../dbConfigs/dbAPIs/dbWorkDayLog.api");
const IworkDayLog_1 = require("./../interface/IworkDayLog");
const main_1 = require("../configs/main");
class WorkDayLogsAPIRouter extends baseApi_route_1.BaseAPIRoute {
    constructor(passport) {
        super(passport, '');
        this._dbAPI = new dbWorkDayLog_api_1.DBWorkDayLogAPI();
    }
    /**
     * 批量获取日报
     */
    getDatas(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = req.query;
            const wdlList = yield this._dbAPI.getWorkDayLogList(searchParams);
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                status: true,
                data: wdlList
            });
            return resJSON;
        });
    }
    /**
     * 根据ID获取日报
     */
    getData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const wdl = yield this._dbAPI.getWorkDayLogById(id);
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: !!wdl,
                message: wdl ? '成功获取日志' : '获取日志失败',
                data: wdl
            });
            return resJSON;
        });
    }
    /**
     * 添加日报
     */
    postData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { id } = _a, body = __rest(_a, ["id"]);
            if (!body.date) {
                throw new Error('日志日期能为空');
            }
            const currentUser = req.user;
            const useId = currentUser._id.toString();
            const dateStr = typeof body.date === 'string' ? body.date : body.date.format('yyyy/MM/dd');
            body.date = new Date(dateStr + ' 12:00:00');
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false,
                message: ''
            });
            let wdl;
            if (id) {
                wdl = yield this._dbAPI.updateWorkDayLogById(id, body);
                resJSON.status = !!wdl;
                resJSON.message = wdl ? '成功添加日志' : '添加日志失败';
            }
            else {
                const findWDL = yield this._dbAPI.getWorkDayLogByUserAndDate(useId, body.date);
                if (findWDL) {
                    resJSON.status = false;
                    resJSON.message = `已有相同日期${body.date.format(main_1.CONST_PARAMS.FORMAT_DATE)}的日志`;
                    resJSON.data = new IworkDayLog_1.WorkDayLog(findWDL);
                }
                else {
                    body.user = useId;
                    wdl = yield this._dbAPI.addWorkDayLog(body);
                    resJSON.status = !!wdl;
                    resJSON.message = wdl ? '成功添加日志' : '添加日志失败';
                }
            }
            return resJSON;
        });
    }
    /**
     * 根据ID更新日报
     */
    updateData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const body = req.body;
            const currentUser = req.user;
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false
            });
            const dayLogs = yield this._dbAPI.getWorkDayLogById(id);
            if (dayLogs.user.id !== currentUser._id.toString()) {
                resJSON.message = '你没有更新此日志内容的权限';
            }
            else {
                const wdl = yield this._dbAPI.updateWorkDayLogById(id, body);
                resJSON.status = !!wdl;
                resJSON.message = wdl ? '成功更新日志' : '更新日志失败';
            }
            return resJSON;
        });
    }
    /**
     * 根据ID删除日报
     */
    deleteData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const body = req.body;
            const currentUser = req.user;
            const resJSON = new responseJson_model_1.ResponseJSONModel({
                isLogin: true,
                status: false
            });
            let authority = true;
            if (currentUser.level !== 0) {
                const dayLogs = yield this._dbAPI.getWorkDayLogById(id);
                if (dayLogs.user.id !== currentUser._id.toString()) {
                    resJSON.message = '你没有删除此日志内容的权限';
                    authority = false;
                }
            }
            if (authority) {
                const wdl = yield this._dbAPI.deleteWorkDayLogById(id);
                resJSON.status = !!wdl;
                resJSON.message = wdl ? '成功删除日志' : '删除日志失败';
            }
            return resJSON;
        });
    }
}
exports.WorkDayLogsAPIRouter = WorkDayLogsAPIRouter;
//# sourceMappingURL=workDayLogs.route.js.map