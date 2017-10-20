"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const main_1 = require("../configs/main");
const db_configs_1 = require("../dbConfigs/db.configs");
exports.default = (passport) => {
    const opts = {
        secretOrKey: main_1.CONST_PARAMS.JWT_SECRET_OR_KEY,
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
            passport_jwt_1.ExtractJwt.fromHeader('token'),
            passport_jwt_1.ExtractJwt.fromBodyField('token'),
            passport_jwt_1.ExtractJwt.fromUrlQueryParameter('token'),
            passport_jwt_1.ExtractJwt.fromUrlQueryParameter('token')
        ])
    };
    passport.use(new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
        db_configs_1.UserInfoModel.findOne({ _id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                if (user.status === 0) {
                    done(null, false, { message: '该账号已被禁用, 请联系管理员! ' });
                }
                else {
                    done(null, user);
                }
            }
            else {
                done(null, false, { message: '找不到该用户, 请重新登陆或联系管理员' });
            }
        });
    }));
};
//# sourceMappingURL=passport.js.map