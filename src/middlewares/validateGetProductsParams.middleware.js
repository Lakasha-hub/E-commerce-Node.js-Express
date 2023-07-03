import { productService } from "../dao/mongo/manager/index.js";

const validateGetQueryParams = async (req, res, next) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const documentsCount = await productService.countDocuments();

  if (limit > documentsCount) {
    return res.sendBadRequest(
      `limit is greater than the total amount of documents`
    );
  }

  [limit, page].forEach((p) => {
    if (p <= 0 || (isNaN(p) && p !== undefined)) {
      return res.sendBadRequest(`${p} is not a valid number`);
    }
  });

  if (query) {
    const filter = query.split(":");
    const key = filter[0].trim();
    let value = filter[1].trim();
    if (typeof parseInt(value) === "number" && !isNaN(parseInt(value)))
      value = parseInt(value);
    req.query.queryUpdated = { [key]: value };
  }

  if (!sort) {
    req.query.sortUpdated = undefined;
    return next();
  }

  if (sort !== "asc" && sort !== "desc") {
    return res.sendBadRequest(`sort is not valid`);
  }

  req.query.sortUpdated = { price: sort };
  next();
};

export { validateGetQueryParams };
