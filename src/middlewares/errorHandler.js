export default (error, req, res, next) => {
  req.logger.fatal(error);
  res.sendError(error);
};
