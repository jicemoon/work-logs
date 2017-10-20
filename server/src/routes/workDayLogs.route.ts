import { Request, Response, NextFunction } from 'express';
import { ResponseJSONModel, ResponsePagingJSON } from './responseJson.model';
import { BaseAPIRoute } from './baseApi.route';
import { DBWorkDayLogAPI } from '../dbConfigs/dbAPIs/dbWorkDayLog.api';
import { WorkDayLog, IWorkDayLog } from './../interface/IworkDayLog';
import { IUserInfoModel } from './../interface/IuserInfo';
import { IWorkDayLogSearchParams, IPageParams } from './../interface/IRequestParams';
import { CONST_PARAMS } from '../configs/main';

export class WorkDayLogsAPIRouter extends BaseAPIRoute<WorkDayLog, DBWorkDayLogAPI> {
  constructor (passport) {
    super(passport, '');
    this._dbAPI = new DBWorkDayLogAPI();
  }
  /**
   * 批量获取日报
   */
  async getDatas(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<ResponsePagingJSON<WorkDayLog>>> {
    const searchParams: IWorkDayLogSearchParams = req.query;
    const wdlList: ResponsePagingJSON<WorkDayLog> = await this._dbAPI.getWorkDayLogList(searchParams);
    const resJSON = new ResponseJSONModel<ResponsePagingJSON<WorkDayLog>> ({
      status: true,
      data: wdlList
    });
    return resJSON;
  }
  /**
   * 根据ID获取日报
   */
  async getData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<WorkDayLog>> {
    const id = req.params.id;
    const wdl = await this._dbAPI.getWorkDayLogById(id);
    const resJSON = new ResponseJSONModel<WorkDayLog>({
      isLogin: true,
      status: !!wdl,
      message: wdl ? '成功获取日志' : '获取日志失败',
      data: wdl
    });
    return resJSON;
  }
  /**
   * 添加日报
   */
  async postData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<WorkDayLog>> {
    const {id, ...body} = req.body;
    if (!body.date) {
      throw new Error('日志日期能为空');
    }
    const currentUser: IUserInfoModel = req.user;
    const useId = currentUser._id.toString();
    const dateStr = typeof body.date === 'string' ? body.date : body.date.format('yyyy/MM/dd');
    body.date = new Date(dateStr + ' 12:00:00');
    const resJSON = new ResponseJSONModel<WorkDayLog>({
      isLogin: true,
      status: false,
      message: ''
    });
    let wdl;
    if (id) {
      wdl = await this._dbAPI.updateWorkDayLogById(id, body);
      resJSON.status = !!wdl;
      resJSON.message = wdl ? '成功添加日志' : '添加日志失败';
    } else {
      const findWDL = await this._dbAPI.getWorkDayLogByUserAndDate(useId, body.date);
      if (findWDL) {
        resJSON.status = false;
        resJSON.message = `已有相同日期${(body.date as Date).format(CONST_PARAMS.FORMAT_DATE)}的日志`;
        resJSON.data = new WorkDayLog(findWDL);
      } else {
        body.user = useId;
        wdl = await this._dbAPI.addWorkDayLog(body);
        resJSON.status = !!wdl;
        resJSON.message = wdl ? '成功添加日志' : '添加日志失败';
      }
    }
    return resJSON;
  }
  /**
   * 根据ID更新日报
   */
  async updateData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<WorkDayLog>> {
    const id = req.params.id;
    const body: IWorkDayLog = req.body;
    const currentUser: IUserInfoModel = req.user;
    const resJSON = new ResponseJSONModel<WorkDayLog>({
      isLogin: true,
      status: false
    });
    const dayLogs = await this._dbAPI.getWorkDayLogById(id);
    if (dayLogs.user.id !== currentUser._id.toString()) {
      resJSON.message = '你没有更新此日志内容的权限';
    } else {
      const wdl = await this._dbAPI.updateWorkDayLogById(id, body);
      resJSON.status = !!wdl;
      resJSON.message = wdl ? '成功更新日志' : '更新日志失败';
    }
    return resJSON;
  }
  /**
   * 根据ID删除日报
   */
  async deleteData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<WorkDayLog>> {
    const id = req.params.id;
    const body: IWorkDayLog = req.body;
    const currentUser: IUserInfoModel = req.user;
    const resJSON = new ResponseJSONModel<WorkDayLog>({
      isLogin: true,
      status: false
    });
    let authority = true;
    if (currentUser.level !== 0) {
      const dayLogs = await this._dbAPI.getWorkDayLogById(id);
      if (dayLogs.user.id !== currentUser._id.toString()) {
        resJSON.message = '你没有删除此日志内容的权限';
        authority = false;
      }
    }
    if (authority) {
      const wdl = await this._dbAPI.deleteWorkDayLogById(id);
      resJSON.status = !!wdl;
      resJSON.message = wdl ? '成功删除日志' : '删除日志失败';
    }
    return resJSON;
  }
}
