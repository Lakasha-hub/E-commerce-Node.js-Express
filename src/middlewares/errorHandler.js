export default (error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
  // req.logger.fatal(error);
  // res.sendError(error);
};
