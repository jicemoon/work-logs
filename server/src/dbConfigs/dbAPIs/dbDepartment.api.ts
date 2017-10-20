import { IDepartmentModel, IDepartment, Department } from './../../interface/Idepartment';
import { IDBBaseAPI } from './dbBase.api';
import { DepartmentModel } from '../db.configs';

export class DBDepartmentAPI implements IDBBaseAPI<IDepartmentModel> {
  public _model = DepartmentModel;
  /**
   * 查询所有的部门列表
   */
  async getDepartmentList (): Promise<Department[]> {
    const list: IDepartmentModel[] = await this._model.find({}).exec();
    const departList: Department[] = list.map((item) => {
      return new Department( item );
    });
    return departList;
  }
  /**
   * 根据ID查找部门名称
   * @param id 部门id
   */
  async getDepartmentById (id: string): Promise<Department> {
    const departModel: IDepartmentModel = await this._model.findOne({_id: id}).exec();
    return new Department(departModel);
  }
  /**
   * 新增部门
   */
  async addDepartment (body: IDepartment): Promise<Department> {
    const depart = new DepartmentModel(body);
    const error = depart.validateSync();
    if (error) {
      throw error;
    }
    const departM: IDepartmentModel = await depart.save();
    if (departM) {
      return new Department(departM);
    }
    return null;
  }
  /**
   * 根据ID更新部门信息
   * @param id 要更新的账户id
   * @param body 更新后的用户信息
   */
  async updateDepartmentById (id: string, body: IDepartment): Promise<Department> {
    body.updateDate = new Date();
    const depart: IDepartmentModel = await this._model.findByIdAndUpdate(id, body).exec();
    if (!depart) {
      return null;
    }
    else {
      return new Department(depart);
    }
  }
  /**
   * 根据ID删除用户
   * @param id 要删除的账户id
   */
  async deleteDepartmentById (id: string): Promise<Department> {
    const depart: IDepartmentModel = await this._model.findByIdAndRemove(id).exec();
    if (!depart) {
      return null;
    }
    return new Department(depart);
  }
}
