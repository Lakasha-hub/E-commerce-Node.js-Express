import LoggerService from "../services/logger.service.js";
import { options } from "../config/server.config.js";

const enviroment = options.env;
console.log(`Environment in use: ${enviroment}`);

export const attachLoggers = (req, res, next) => {
  const loggerService = new LoggerService(enviroment);
  req.logger = loggerService.logger;
  req.logger.http(
    `${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
