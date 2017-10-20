"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./../configs/main");
class Department {
    constructor(dep) {
        if (typeof dep === 'string') {
            this.id = dep;
        }
        else if (dep) {
            this.id = dep._id;
            this.name = dep.name;
            this.updateDate = dep.updateDate && (new Date(dep.updateDate)).format(main_1.CONST_PARAMS.FORMAT_DATE_TIME);
            this.createDate = dep.updateDate && (new Date(dep.createDate)).format(main_1.CONST_PARAMS.FORMAT_DATE_TIME);
        }
    }
}
exports.Department = Department;
//# sourceMappingURL=Idepartment.js.map