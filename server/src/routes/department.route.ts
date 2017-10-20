import { DBDepartmentAPI } from './../dbConfigs/dbAPIs/dbDepartment.api';
import { Department, IDepartment } from './../interface/Idepartment';
import { Request, Response, NextFunction } from 'express';
import { ResponseJSONModel } from './responseJson.model';
import { BaseAPIRoute } from './baseApi.route';
import { IUserInfoModel } from '../interface/IuserInfo';

export class DepartmentAPIRouter extends BaseAPIRoute<Department, DBDepartmentAPI> {
  constructor (passport) {
    super(passport);
    this._dbAPI = new DBDepartmentAPI();
  }
  /**
   * 获取全部部门列表
   */
  async getDatas(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<Department[]>> {
    const currentUser = req.user;
    const departments: Department[] = await this._dbAPI.getDepartmentList();
    const resJSON = new ResponseJSONModel<Department[]> ({
      isLogin: true,
      status: true,
      message: '获取成功',
      data: departments
    });
    return resJSON;
  }
  /**
   * 根据ID获取对应数据
   */
  async getData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<Department>> {
    const id = req.params.id;
    const resJSON = new ResponseJSONModel<Department>({
      isLogin: true,
      status: false
    });
    if (!id) {
      resJSON.message = `请提供要查询部门的ID`;
    } else {
      const depart = await this._dbAPI.getDepartmentById (id);
      resJSON.status = !!depart;
      resJSON.data = depart;
      resJSON.message = !!depart ? '查询成功' : '查询失败, 没有找到该部门的信息';
    }
    return resJSON;
  }
  /**
   * 修改或添加部门
   */
  private async addOrModifyData(currentUser: IUserInfoModel, body: IDepartment, id?: string): Promise<ResponseJSONModel<Department>> {
    const isEdit = !!id;
    const msgTitle = isEdit ? '修改' : '添加';
    const resJSON = new ResponseJSONModel<Department>({
      isLogin: true,
      status: false,
      data: null
    });
    if (!currentUser || currentUser.level !== 0) {
      resJSON.message = `您没有${msgTitle}部门信息的权限`;
    }
    else {
      try {
        let depart: Department;
        if (isEdit) {
          depart = await this._dbAPI.updateDepartmentById(id, body);
        } else {
          depart = await this._dbAPI.addDepartment(body);
        }
        resJSON.message = !!depart ? `${msgTitle}部门成功` : `${msgTitle}部门失败`;
        resJSON.data = depart;
        resJSON.status = !!depart;
      } catch (e) {
        if (e.message.indexOf('duplicate key error') !== -1) {
          resJSON.message = '已有相同名称的部门';
        }
        else {
          throw e;
        }
      }
    }
    return resJSON;
  }
  /**
   * 添加部门
   */
  async postData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<Department>> {
    return await this.addOrModifyData(req.user, req.body);
  }
  /**
   * 更新部门名称
   */
  async updateData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<Department>> {
    return await this.addOrModifyData(req.user, req.body, req.params.id);
  }
  /**
   * 根据ID删除部门
   */
  async deleteData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<Department>> {
    const currentUser: IUserInfoModel = req.user;
    const id = req.params.id;
    const resJSON = new ResponseJSONModel<Department>({
      isLogin: true,
      status: false
    });
    if (!id) {
      resJSON.message = `请提供要删除部门的ID`;
    } else if (!currentUser || currentUser.level !== 0) {
      resJSON.message = `您没有删除部门信息的权限`;
    } else {
      const depart = await this._dbAPI.deleteDepartmentById (id);
      resJSON.status = !!depart;
      resJSON.message = !!depart ? '删除部门成功' : '删除部门失败, 没有找到该部门的信息';
    }
    return resJSON;
  }
}


