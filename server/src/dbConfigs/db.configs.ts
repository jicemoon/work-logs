import * as mongoose from 'mongoose';
import { CONST_PARAMS } from './../configs/main';
import { WorkDayLogSchema } from './dbSchema/workDayLog.schema';
import { UserInfoSchema } from './dbSchema/userInfo.schema';
import { DepartmentSchema } from './dbSchema/department.schema';
import { IWorkDayLogModel } from '../interface/IworkDayLog';
import { IUserInfoModel } from '../interface/IuserInfo';
import { IDepartmentModel } from '../interface/Idepartment';

///数据库连接
const connection = mongoose.createConnection(CONST_PARAMS.MONGO_URI, {
  useMongoClient: true
});
const UserInfoModel = connection.model<IUserInfoModel>('userInfos', UserInfoSchema);
const WorkDayLogsModel = connection.model<IWorkDayLogModel>('workDayLogs', WorkDayLogSchema);
const DepartmentModel = connection.model<IDepartmentModel>('departments', DepartmentSchema);
export { connection, WorkDayLogsModel, UserInfoModel, DepartmentModel };
