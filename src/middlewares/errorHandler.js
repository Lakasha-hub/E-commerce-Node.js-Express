export default (error, req, res, next) => {
  console.log(error);
  res.sendError(error);
};
