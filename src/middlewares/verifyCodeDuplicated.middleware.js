import { productsService } from "../services/repositories/index.js";

const verifyCodeDuplicated = async (req, res, next) => {
  const { code } = req.body;
  const result = await productsService.getBy({ code: code });
  if (result) {
    return res.status(400).json({
      error: `The code: ${code} is already in use`,
    });
  }
  next();
};

export { verifyCodeDuplicated };
