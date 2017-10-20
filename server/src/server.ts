import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as path from 'path';
import * as cors from 'cors';
import * as passport from 'passport';
import errorhandler = require('errorhandler');
import methodOverride = require('method-override');

import { CONST_PARAMS } from './configs/main';
import { DepartmentAPIRouter } from './routes/department.route';
import { UserInfoAPIRouter } from './routes/userInfo.route';
import { WorkDayLogsAPIRouter } from './routes/workDayLogs.route';
import myPassport from './shared/passport';

/**
 * The server.
 *
 * @class Server
 */
class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.api();
  }
  /**
   * Create REST API routes
   * @class Server
   * @method api
   */
  public api() {
    this.app.use(`${CONST_PARAMS.API_ROOT}/v${CONST_PARAMS.API_VERSION}/user`, (new UserInfoAPIRouter(passport)).router);
    this.app.use(`${CONST_PARAMS.API_ROOT}/v${CONST_PARAMS.API_VERSION}/department`, (new DepartmentAPIRouter(passport)).router);
    this.app.use(`${CONST_PARAMS.API_ROOT}/v${CONST_PARAMS.API_VERSION}/workDayLog`, (new WorkDayLogsAPIRouter(passport)).router);
  }
  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(passport.initialize());
    myPassport(passport);
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
    this.app.use(methodOverride());
    this.app.use(errorhandler());
  }

  /**
   * Create router
   *
   * @class Server
   * @method routes
   */
  public routes() {
    //empty for now
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.send('测试页面');
    });
  }
}
export default new Server().app;
