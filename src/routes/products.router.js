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
    this.get("/", [validateGetQueryParams], productsGet);

    this.post("/", [validateProductCamps, verifyCodeDuplicated], productsPost);

    this.get("/:id", [verifyMongoID], productsGetById);

    this.put("/:id", [verifyMongoID], productsPut);

    this.delete("/:id", [verifyMongoID], productsDelete);
  }
}
