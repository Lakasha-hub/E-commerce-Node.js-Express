import BaseRouter from "./router.js";

import { validateGetQueryParams } from "../middlewares/validateGetProductsParams.middleware.js";
import { verifyCodeDuplicated } from "../middlewares/verifyCodeDuplicated.middleware.js";
import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";
import { validateProductCamps } from "../middlewares/validateProductCamps.middleware.js";

import {
  productsPost,
  productsGet,
  productsGetById,
  productsPut,
  productsDelete,
} from "../controllers/products.controller.js";
import { generateProduct } from "../mocks/product.mock.js";

export default class ProductsRouter extends BaseRouter {
  init() {
    this.get("/mockingproducts", ["USER_ROLE", "ADMIN_ROLE"], (req, res) => {
      let mockingProducts = [];
      for (let i = 0; i < 100; i++) {
        mockingProducts.push(generateProduct());
      }
      res.sendSuccessWithPayload(mockingProducts);
    });
    
    this.get(
      "/",
      ["USER_ROLE", "ADMIN_ROLE"],
      validateGetQueryParams,
      productsGet
    );

    this.post(
      "/",
      ["ADMIN_ROLE"],
      validateProductCamps,
      verifyCodeDuplicated,
      productsPost
    );

    this.get(
      "/:id",
      ["USER_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      productsGetById
    );

    this.put("/:id", ["ADMIN_ROLE"], verifyMongoID, productsPut);

    this.delete("/:id", ["ADMIN_ROLE"], verifyMongoID, productsDelete);

  }
}
