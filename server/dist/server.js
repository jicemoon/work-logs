"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const logger = require("morgan");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const errorhandler = require("errorhandler");
const methodOverride = require("method-override");
const main_1 = require("./configs/main");
const department_route_1 = require("./routes/department.route");
const userInfo_route_1 = require("./routes/userInfo.route");
const workDayLogs_route_1 = require("./routes/workDayLogs.route");
const passport_1 = require("./shared/passport");
/**
 * The server.
 *
 * @class Server
 */
class Server {
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
    api() {
        this.app.use(`${main_1.CONST_PARAMS.API_ROOT}/v${main_1.CONST_PARAMS.API_VERSION}/user`, (new userInfo_route_1.UserInfoAPIRouter(passport)).router);
        this.app.use(`${main_1.CONST_PARAMS.API_ROOT}/v${main_1.CONST_PARAMS.API_VERSION}/department`, (new department_route_1.DepartmentAPIRouter(passport)).router);
        this.app.use(`${main_1.CONST_PARAMS.API_ROOT}/v${main_1.CONST_PARAMS.API_VERSION}/workDayLog`, (new workDayLogs_route_1.WorkDayLogsAPIRouter(passport)).router);
    }
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    config() {
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
        passport_1.default(passport);
        this.app.use((req, res, next) => {
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
    routes() {
        //empty for now
        this.app.get('/', (req, res) => {
            res.send('测试页面');
        });
    }
}
exports.default = new Server().app;
//# sourceMappingURL=server.js.map