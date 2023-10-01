export default (error, req, res, next) => {
  res.sendError(error);
};
