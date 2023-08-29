export default (error, req, res, next) => {
  console.log(error);
  req.logger.debug(error);
  res.sendError(error);
};
