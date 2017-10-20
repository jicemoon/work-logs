"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//部门
const DepartmentSchema = new mongoose_1.Schema({
    //部门名称
    name: {
        type: String,
        required: [true, '部门名称不能为空'],
        trim: true,
        unique: true
    },
    updateDate: {
        type: Date
    },
    //创建日期
    createDate: {
        type: Date
    }
});
exports.DepartmentSchema = DepartmentSchema;
DepartmentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createDate = new Date();
    }
    this.updateDate = new Date();
    next();
});
//# sourceMappingURL=department.schema.js.map