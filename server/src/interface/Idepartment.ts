import { CONST_PARAMS } from './../configs/main';
import { IDepartmentModel } from './Idepartment';
import { Document } from 'mongoose';

import { IBase } from './Ibase';

export interface IDepartment extends IBase {
  name: string;
}
export class Department {
  id: string;
  name: string;
  updateDate?: string;
  createDate?: string;

  constructor ( dep: IDepartmentModel | string) {
    if (typeof dep === 'string') {
      this.id = dep;
    }
    else if (dep) {
      this.id = dep._id;
      this.name = dep.name;
      this.updateDate = dep.updateDate && (new Date(dep.updateDate)).format(CONST_PARAMS.FORMAT_DATE_TIME);
      this.createDate = dep.updateDate && (new Date(dep.createDate)).format(CONST_PARAMS.FORMAT_DATE_TIME);
    }
  }
}
export interface IDepartmentModel extends IDepartment, Document {
}
