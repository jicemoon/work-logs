export interface ILogger {
  info(msg: any): ILogger;
  log(msg: any): ILogger;
  warn(msg: any): ILogger;
  error(msg: any): ILogger;
}

export class Logger implements ILogger {
  log(msg: any): Logger {
    console.log(msg);
    return this;
  }
  info(msg: any): Logger {
    console.info(msg);
    return this;
  }

  warn(msg: any): Logger {
    console.warn(msg);
    return this;
  }

  error(msg: any): Logger {
    console.error(msg);
    return this;
  }

}
