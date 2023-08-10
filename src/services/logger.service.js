import winston from "winston";

export default class LoggerService {
  constructor(env) {
    this.logger = this.createLog(env);
    this.levels = {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5,
    };
  }

  createLog = (env) => {
    switch (env) {
      case "dev":
        return winston.createLogger({
          levels: this.levels,
          transports: [
            new winston.transports.Console({
              level: "debug",
              format: winston.format.simple(),
            }),
          ],
        });
      case "prod":
        return winston.createLogger({
          levels: this.levels,
          transports: [
            new winston.transports.Console({
              level: "info",
              format: winston.format.simple(),
            }),
            new winston.transports.File({
              level: "error",
              filename: "./errors.log",
              format: winston.format.simple(),
            }),
          ],
        });
    }
  };
}
