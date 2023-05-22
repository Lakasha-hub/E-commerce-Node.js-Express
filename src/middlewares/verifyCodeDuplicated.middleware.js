import ProductsManager from "../dao/mongo/manager/products.manager.js";

const productManager = new ProductsManager();

const verifyCodeDuplicated = async (req, res, next) => {
  const { code } = req.body;
  const result = await productManager.getProductBy({ code: code });
  if (result) {
    return res.status(400).json({
      error: `The code: ${code} is already in use`,
    });
  }
  next();
};

export { verifyCodeDuplicated };
