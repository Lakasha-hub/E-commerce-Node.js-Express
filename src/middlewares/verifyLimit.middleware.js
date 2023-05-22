import ProductsManager from "../dao/mongo/manager/products.manager.js";
const productManager = new ProductsManager();

const validateLimit = async (req, res, next) => {
  const { limit } = req.query;
  const documentsCount = await productManager.countDocuments();
  //Verify limit is a valid number
  if (
    limit <= 0 ||
    (isNaN(limit) && limit !== undefined) ||
    limit > documentsCount
  ) {
    return res.status(400).json({
      error: "limit is not a valid number",
    });
  }
  next();
};

export { validateLimit };
