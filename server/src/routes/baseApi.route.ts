import { ResponseJSONModel, ResponsePagingJSON } from './responseJson.model';
import { Router, NextFunction, Request, Response } from 'express';
import { CONST_PARAMS } from '../configs/main';

export class BaseAPIRoute<T, U> {
  public router: Router;
  protected _dbAPI: U;
  protected root: string;
  protected passport;

  constructor (passport: any, root: string = '') {
    this.root = root ? ('/' + root) : '';
    this.passport = passport;
    this.router = Router();
    this.passportAuthenticate = this.passportAuthenticate.bind(this);
    this.initRouter();
  }
  /**
   * 批量获取数据
   */
  async getDatas(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<T[] | ResponsePagingJSON<T>>> {
    return null;
  }
  /**
   * 根据ID获取对应数据
   */
  async getData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<T>> {
    return null;
  }
  /**
   * 添加数据
   */
  async postData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<T>> {
    return null;
  }
  /**
   * 根据ID更新数据
   */
  async updateData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<T>> {
    return null;
  }
  /**
   * 根据ID删除数据
   */
  async deleteData(req: Request, res: Response, next: NextFunction): Promise<ResponseJSONModel<T>> {
    return null;
  }
  /**
   * 将每一个Route处理函数, 包裹在try...catch中并返回;
   */
  checkingRouteError(routeHandler: (req: Request, res: Response, next: NextFunction) => Promise<ResponseJSONModel<T|T[]|ResponsePagingJSON<T>>>): (req: Request, res: Response, next: NextFunction) => any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const resData = await routeHandler.call(this, req, res, next);
        res.json(resData);
      } catch (err) {
        const messages: string[] = [];
        if (err.errors) {
          const keys = Object.keys(err.errors);
          for ( const key of keys) {
            messages.push(err.errors[key].message);
          }
        } else {
          messages.push(err.message);
        }
        res.json(new ResponseJSONModel<string>({
          isLogin: true,
          status: false,
          message: messages.join(' && '),
          data: null
        }));
      }
    };
  }
  passportAuthenticate (req: Request, res: Response, next: NextFunction) {
    this.passport.authenticate('jwt', { session: false }, (err, data, info: any ) => {
      if (err) {
        next(err);
      } else if (data) {
        req.user = data;
        next();
      } else if (info) {
        let message = '';
        switch (true) {
          case (info.name === 'TokenExpiredError'):
            const expiredTime = (new Date(info.expiredAt)).format(CONST_PARAMS.FORMAT_DATE_TIME);
            message = `登陆授权已过期(${expiredTime}), 请重新登陆已获取授权`;
            break;
          case (info.name === 'JsonWebTokenError' || /Unexpected\s+token/i.test(info.message)):
            message = `无效的身份验证`;
            break;
          default:
            message = '身份验证失败, 请重新登陆';
        }
        const resJSON = new ResponseJSONModel({
          isLogin: false,
          status: false,
          message
        });
        res.json(resJSON);
      }
    })(req, res, next);
  }
  initRouter () {
    this.router.get(`${this.root}/`, this.passportAuthenticate, this.checkingRouteError(this.getDatas));
    this.router.get(`${this.root}/:id`, this.passportAuthenticate, this.checkingRouteError(this.getData));
    this.router.post(`${this.root}/`, this.passportAuthenticate, this.checkingRouteError(this.postData));
    this.router.put(`${this.root}/:id`, this.passportAuthenticate, this.checkingRouteError(this.updateData));
    this.router.delete(`${this.root}/:id`, this.passportAuthenticate, this.checkingRouteError(this.deleteData));
  }
}

