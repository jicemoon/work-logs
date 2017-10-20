"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../configs/main");
class WorkDayLog {
    constructor(work, needUser = true) {
        this.id = work.id || work._id;
        if (work.date) {
            this.date = (new Date(work.date)).format(main_1.CONST_PARAMS.FORMAT_DATE);
        }
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
        this.updateDate = work.updateDate && (new Date(work.updateDate)).format(main_1.CONST_PARAMS.FORMAT_DATE_TIME);
        this.createDate = work.createDate && (new Date(work.createDate)).format(main_1.CONST_PARAMS.FORMAT_DATE_TIME);
    }
}
exports.WorkDayLog = WorkDayLog;
//# sourceMappingURL=IworkDayLog.js.map