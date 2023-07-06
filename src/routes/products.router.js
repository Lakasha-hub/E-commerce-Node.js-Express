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

export default class ProductsRouter extends BaseRouter {
  init() {
    this.get(
      "/",
      ["USER_ROLE", "ADMIN_ROLE"],
      validateGetQueryParams,
      productsGet
    );

    this.post(
      "/",
      ["USER_ROLE", "ADMIN_ROLE"],
      validateProductCamps, verifyCodeDuplicated,
      productsPost
    );

    this.get(
      "/:id",
      ["USER_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      productsGetById
    );

    this.put("/:id", ["USER_ROLE", "ADMIN_ROLE"], verifyMongoID, productsPut);

    this.delete(
      "/:id",
      ["USER_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      productsDelete
    );
  }
}
