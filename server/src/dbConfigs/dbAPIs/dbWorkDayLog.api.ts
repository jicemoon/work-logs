import { IWorkDayLogModel, IWorkDayLog, WorkDayLog } from './../../interface/IworkDayLog';
import { IUserInfoModel } from './../../interface/IuserInfo';
import { IDBBaseAPI } from './dbBase.api';
import { WorkDayLogsModel, UserInfoModel } from '../db.configs';
import { ResponsePagingJSON, IPageData } from '../../routes/responseJson.model';
import { IWorkDayLogSearchParams, IPageParams } from '../../interface/IRequestParams';
export class DBWorkDayLogAPI implements IDBBaseAPI<IWorkDayLogModel> {
  public _model = WorkDayLogsModel;
  /**
   * 批量获取日志列表
   */
  async getWorkDayLogList (searchParams: IWorkDayLogSearchParams): Promise<ResponsePagingJSON<WorkDayLog>> {
    const params: {user?: any, date?: any} = {};
    if (searchParams.userId) {
      params.user = searchParams.userId;
    }
    if (searchParams.departmentId) {
      const users: IUserInfoModel[] = await UserInfoModel.find({ department: searchParams.departmentId }).select('_id');
      params.user = {$in: users};
    }
    if (searchParams.date) {
      const startParams = new Date(searchParams.date);
      const start = new Date(startParams.getFullYear(), startParams.getMonth(), startParams.getDate());
      let end: Date, endParams: Date;
      if (searchParams.endDate) {
        endParams = new Date(searchParams.endDate);
        endParams = new Date(endParams.getFullYear(), endParams.getMonth(), endParams.getDate());
      } else {
        endParams = start;
      }
      end = new Date(endParams.getTime() + 24 * 3600 * 1000);
      params.date = { '$gte': start, '$lt': end };
    }
    searchParams.pageIndex = searchParams.pageIndex || 1;
    searchParams.pageSize = searchParams.pageSize || 20;
    const query = this._model.find(params).sort({_id: -1});
    const total = await this._model.count(query);
    const list: IWorkDayLogModel[] = await query.skip(searchParams.pageSize * (searchParams.pageIndex - 1)).limit(searchParams.pageSize).exec();
    const wdlList: WorkDayLog[] = list.map(item => {
      return new WorkDayLog(item);
    });
    const pageData: IPageData = {
      pageSize: searchParams.pageSize,
      pageIndex: searchParams.pageIndex,
      total
    };
    return new ResponsePagingJSON<WorkDayLog>(pageData, wdlList);
  }
  /**
   * 根据ID获取单个日志
   */
  async getWorkDayLogById (id: string): Promise<WorkDayLog> {
    const wdl: IWorkDayLogModel = await this._model.findOne({_id: id});
    return wdl ? new WorkDayLog(wdl) : null;
  }
  /**
   * 根据用户和日期获取日志
   * @param userId
   * @param date
   */
  async getWorkDayLogByUserAndDate(userId: string, date: Date): Promise<IWorkDayLogModel> {
    return await this._model.findOne({date, user: userId});
  }
  /**
   * 新增日志
   */
  async addWorkDayLog(body: IWorkDayLog): Promise<WorkDayLog> {
    let wdl: IWorkDayLogModel = new WorkDayLogsModel(body);
    const error = wdl.validateSync();
    if (error) {
      throw error;
    }
    wdl = await wdl.save();
    return wdl ? new WorkDayLog(wdl, false) : null;
  }
  /**
   * 根据ID更新日志
   */
  async updateWorkDayLogById (id: string, body: IWorkDayLog): Promise<WorkDayLog> {
    body.updateDate = new Date();
    const wdl: IWorkDayLogModel = await this._model.findByIdAndUpdate(id, body).select('_id');
    return wdl ? new WorkDayLog(wdl) : null;
  }
  /**
   * 根据ID删除日志
   */
  async deleteWorkDayLogById (id: string): Promise<WorkDayLog> {
    const wdl: IWorkDayLogModel = await this._model.findByIdAndRemove(id);
    return wdl ? new WorkDayLog(wdl) : null;
  }
}
