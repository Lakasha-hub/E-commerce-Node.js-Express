import BaseRouter from "./router.js";

import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";

import {
  cartsDeleteAllProducts,
  cartsDeleteProduct,
  cartsGet,
  cartsGetById,
  cartsPost,
  cartsPostProduct,
  cartsUpdateAllProducts,
  cartsUpdateQuantity,
} from "../controllers/carts.controller.js";

export default class CartsRouter extends BaseRouter {
  init() {
    this.get("/", cartsGet);

    this.post("/", cartsPost);

    this.get("/:id", [verifyMongoID], cartsGetById);

    this.put("/:id", [verifyMongoID], cartsUpdateAllProducts);

    this.delete("/:id", [verifyMongoID], cartsDeleteAllProducts);

    this.post("/:id/products/:pid", [verifyMongoID], cartsPostProduct);

    this.put("/:id/products/:pid", [verifyMongoID], cartsUpdateQuantity);

    this.delete("/:id/products/:pid", [verifyMongoID], cartsDeleteProduct);
  }
}
