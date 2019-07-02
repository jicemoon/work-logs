"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const main_1 = require("./../configs/main");
const workDayLog_schema_1 = require("./dbSchema/workDayLog.schema");
const userInfo_schema_1 = require("./dbSchema/userInfo.schema");
const department_schema_1 = require("./dbSchema/department.schema");
///数据库连接
const connection = mongoose.createConnection(main_1.CONST_PARAMS.MONGO_URI, {
    // useMongoClient: true
    useNewUrlParser: true
});
exports.connection = connection;
const UserInfoModel = connection.model('userInfos', userInfo_schema_1.UserInfoSchema);
exports.UserInfoModel = UserInfoModel;
const WorkDayLogsModel = connection.model('workDayLogs', workDayLog_schema_1.WorkDayLogSchema);
exports.WorkDayLogsModel = WorkDayLogsModel;
const DepartmentModel = connection.model('departments', department_schema_1.DepartmentSchema);
exports.DepartmentModel = DepartmentModel;
//# sourceMappingURL=db.configs.js.map