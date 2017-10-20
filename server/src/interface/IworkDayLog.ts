import { IWorkDayLogModel } from './IworkDayLog';
import { IUserInfoModel, UserInfo } from './IuserInfo';
import { IBase } from './Ibase';
import { Document } from 'mongoose';
import { CONST_PARAMS } from '../configs/main';

export interface IWorkDayLog extends IBase {
  date?: Date;
  completed?: string;
  plan?: string;
  progress?: string;
  user?: any;
}
export class WorkDayLog {
  id?: string;
  date?: string;
  completed?: string;
  plan?: string;
  progress?: string;
  //user: UserInfo;
  user?: { id, name?, title?, department?, departmentId?};
  updateDate?: string;
  createDate?: string;

  constructor (work: IWorkDayLogModel, needUser = true) {
    this.id = work.id || work._id;
    this.date = (new Date(work.date)).format(CONST_PARAMS.FORMAT_DATE);
    this.completed = work.completed;
    this.plan = work.plan;
    this.progress = work.progress;
    if (needUser && work.user) {
      this.user = {
        id: work.user.id || work.user._id.toString(),
        name: work.user.nickname,
        title: work.user.title,
        departmentId: work.user.department ? work.user.department.id : undefined,
        department: work.user.department ? work.user.department.name : undefined
      };
    }
    this.updateDate = work.updateDate && (new Date(work.updateDate)).format(CONST_PARAMS.FORMAT_DATE_TIME);
    this.createDate = work.createDate && (new Date(work.createDate)).format(CONST_PARAMS.FORMAT_DATE_TIME);
  }
}
export interface IWorkDayLogModel extends IWorkDayLog, Document {
}

