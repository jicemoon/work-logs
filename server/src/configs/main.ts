///mongodb://workAdmin:aaaa3333@ds157702.mlab.com:57702/worklogs

export const CONST_PARAMS = {
  PORT: 4925, //api端口
  JWT_SECRET_OR_KEY: 'JICEMOON',  //jwt密匙
  JWT_EXPIRES_IN: 24 * 60 * 60, //jwt失效时间, 单位为秒
  API_ROOT: '/api', //api跟路由路径
  API_VERSION: '1',  //api版本
  MONGO_URI: 'mongodb://localhost:27017/worklogs',  //数据库连接地址
  FORMAT_DATE: 'yyyy-MM-dd',  //默认日期格式
  FORMAT_TIME: 'hh:mm:ss',  //默认时间格式
  FORMAT_DATE_TIME: 'yyyy-MM-dd hh:mm:ss', //默认时间日期格式
};
