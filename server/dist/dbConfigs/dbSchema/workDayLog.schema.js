"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WorkDayLogSchema = new mongoose_1.Schema({
    //日报日期
    date: {
        type: Date,
        required: [true, '日报日期不能为空']
    },
    //今日完成
    completed: {
        type: String,
        required: [true, '[今日完成]不能为空']
    },
    //明日计划
    plan: {
        type: String,
        required: [true, '[明日计划]不能为空']
    },
    //工作进展
    progress: {
        type: String,
        required: [true, '[工作进展]不能为空']
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, '账号id不能为空'],
        ref: 'userInfos'
    },
    updateDate: {
        type: Date
    },
    //创建日期
    createDate: {
        type: Date
    }
});
exports.WorkDayLogSchema = WorkDayLogSchema;
const autoPopulateLead = function (next) {
    this.populate({
        path: 'user',
        select: '_id nickname title department',
        populate: {
            path: 'department',
            select: '_id name'
        }
    });
    next();
};
const preSaveOrUpdate = function (next) {
    if (this.isNew) {
        this.createDate = new Date();
    }
    this.updateDate = new Date();
    next();
};
WorkDayLogSchema
    .pre('findOne', autoPopulateLead)
    .pre('find', autoPopulateLead)
    .pre('save', preSaveOrUpdate);
//# sourceMappingURL=workDayLog.schema.js.map