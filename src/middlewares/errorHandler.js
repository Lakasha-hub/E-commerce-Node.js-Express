export default (error, req, res, next) => {
  req.logger.debug(error);
  res.sendError(error);
};
