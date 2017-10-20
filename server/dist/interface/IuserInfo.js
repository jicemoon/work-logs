"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./../configs/main");
const Idepartment_1 = require("./Idepartment");
/**账号性别*/
var UserGender;
(function (UserGender) {
    UserGender[UserGender["disabled"] = 0] = "disabled";
    UserGender[UserGender["enabled"] = 1] = "enabled"; //启用
})(UserGender = exports.UserGender || (exports.UserGender = {}));
/**账号状态*/
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["male"] = 0] = "male";
    UserStatus[UserStatus["female"] = 1] = "female";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
/**账号权限*/
var UserLevel;
(function (UserLevel) {
    UserLevel[UserLevel["admin"] = 0] = "admin";
    UserLevel[UserLevel["manager"] = 1] = "manager";
    UserLevel[UserLevel["member"] = 2] = "member";
})(UserLevel = exports.UserLevel || (exports.UserLevel = {}));
class UserInfo {
    constructor(user, needPassword = false) {
        if (typeof user === 'string') {
            this.id = user;
        }
        else if (user) {
            this.id = user.id || user._id.toString();
            this.loginName = user.loginName;
            this.status = user.status;
            this.email = user.email;
            if (needPassword) {
                this.password = user.password;
            }
            this.level = user.level;
            this.nickname = user.nickname || user.loginName;
            this.title = user.title;
            this.avatar = user.avatar;
            this.gender = user.gender;
            this.department = new Idepartment_1.Department(user.department);
            if (user.birthday) {
                (this.birthday = (new Date(user.birthday)).format(main_1.CONST_PARAMS.FORMAT_DATE));
            }
            this.updateDate = user.updateDate && (new Date(user.updateDate)).format(main_1.CONST_PARAMS.FORMAT_DATE_TIME);
            this.createDate = user.createDate && (new Date(user.createDate)).format(main_1.CONST_PARAMS.FORMAT_DATE_TIME);
        }
    }
}
exports.UserInfo = UserInfo;
//# sourceMappingURL=IuserInfo.js.map