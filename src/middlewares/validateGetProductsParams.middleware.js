import ProductsManager from "../dao/mongo/manager/products.manager.js";
const productManager = new ProductsManager();

const validateGetQueryParams = async (req, res, next) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const documentsCount = await productManager.countDocuments();

  if (limit > documentsCount) {
    return res
      .status(400)
      .json({ error: `limit is greater than the total amount of documents` });
  }

  [limit, page].forEach((p) => {
    if (p <= 0 || (isNaN(p) && p !== undefined)) {
      return res.status(400).json({ error: `${p} is not a valid number` });
    }
  });

  if (query) {
    const filter = query.split(":");
    const key = filter[0];
    let value = filter[1];
    if (typeof parseInt(value) === "number" && !isNaN(parseInt(value)))
      value = parseInt(value);
    req.query.queryUpdated = { [key]: value };
  }

  if (!sort) {
    req.query.sortUpdated = undefined;
    return next();
  }

  if (sort !== "asc" && sort !== "desc") {
    return res.status(400).json({ error: `sort is not valid` });
  }

  req.query.sortUpdated = { price: sort };
  next();
};

export { validateGetQueryParams };
