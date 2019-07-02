import { Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

//用户基本信息
const UserInfoSchema = new Schema({
  //登陆账号
  loginName: {
    type: String,
    required: [true, '登陆名不能为空'],
    trim: true,
    unique: [true, '已有相同的账号, 请更换后重新提交'],
    match: [/^[a-z][a-z0-9_]{2,14}$/i, '登陆名必须以字母开头, 3-15位字母和数字']
  },
  //账号状态, 启用[1], 或禁用[0]
  status: {
    type: Number,
    enum: [0, 1], ///禁用[0], 启用[1]
    default: 1
  },
  email: {
    type: String,
    match: /^([\w\-_]+(?:\.[\w\-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i
  },
  //登陆密码
  password: {
    type: String,
    required: [true, '密码不能为空'],
    trim: true,
    validate: [
      {
        validator: v => {
          if (v.length < 6 || v.length > 16) {
            return false;
          }
          return true;
        },
        // message: '密码必须为6-16位',
      },
      {
        validator: v => {
          if (/^\d+$/.test(v)) {
            return false;
          }
          return true;
        },
        // message: '密码不能为纯数字'
      },
      {
        validator: v => {
          if (/^[a-z]+$/i.test(v)) {
            return false;
          }
          return true;
        },
        // message: '密码不能为纯字母'
      }
    ]
  },
  //权限
  level: {
    type: Number,
    enum: [0, 1, 2], //'0': admin, '1': 可修改其他帐号信息, '2': 默认
    default: 2
  },
  //昵称
  nickname: {
    type: String,
    trim: true,
    match: [/^[a-z][a-z0-9_]{2,14}$/i, '登陆名必须以字母开头, 3-15位字母和数字']
  },
  //职称
  title: {
    type: String,
    trim: true,
    validate: [
      {
        validator: v => {
          return !(/\s+/.test(v));
        },
        // message: '职称中不能包含空格'
      }
    ]
  },
  //创建日期
  createDate: {
    type: Date,
    default: Date.now
  },
  //修改日期
  updateDate: {
    type: Date,
    default: Date.now
  },
  //头像地址
  avatar: {
    type: String
  },
  //性别
  gender: {
    type: Number,
    enum: [0, 1], //0: 男, 1: 女
    default: 0
  },
  //所在部门
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments'
  },
  //出生日期
  birthday: {
    type: Date
  },
  token: {
    type: String,
    default: ''
  }
});
UserInfoSchema.methods.compirePassword = (pw: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(pw, hash);
};

UserInfoSchema.methods.turnPassword = (pw: string = ''): string => {
  const salt = bcrypt.genSaltSync(8);
  const hash = bcrypt.hashSync(pw, salt);
  return hash;
};

const autoPopulateLead = function(next) {
  this.populate({
    path: 'department',
    select: '_id name'
  });
  next();
};
const preSaveOrUpdate = function (next) {
  const self = this;
  if (this.isNew) {
    this.createDate = new Date();
    if (!this.nickname) {
      (this.nickname = this.loginName);
    }
    const hash = this.turnPassword(this.password);
    this.password = hash;
  }
  this.updateDate = new Date();
  next();
};
UserInfoSchema
  .pre('findOne', autoPopulateLead)
  .pre('find', autoPopulateLead)
  .pre('save', preSaveOrUpdate);

export { UserInfoSchema };
