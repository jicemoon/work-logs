import { WorkDayLogsAPIRouter } from './../../routes/workDayLogs.route';
import { Schema, Types, model } from 'mongoose';

//部门
const DepartmentSchema = new Schema({
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
DepartmentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createDate = new Date();
  }
  this.updateDate = new Date();
  next();
});
export { DepartmentSchema };

