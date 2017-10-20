import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { CONST_PARAMS } from '../configs/main';
import { UserInfoModel } from '../dbConfigs/db.configs';
import { ResponseJSONModel } from '../routes/responseJson.model';

export default (passport) => {
  const opts: StrategyOptions = {
    secretOrKey: CONST_PARAMS.JWT_SECRET_OR_KEY,
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromHeader('token'),
      ExtractJwt.fromBodyField('token'),
      ExtractJwt.fromUrlQueryParameter('token'),
      ExtractJwt.fromUrlQueryParameter('token')
    ])
  };
  passport.use(new Strategy(opts, function(jwt_payload, done) {
    UserInfoModel.findOne({_id: jwt_payload.id}, function(err, user) {
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
      } else {
        done(null, false, {message: '找不到该用户, 请重新登陆或联系管理员'});
      }
    });
  }));
};
