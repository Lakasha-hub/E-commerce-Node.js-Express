import BaseRouter from "./router.js";

import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";

import {
  cartsDeleteAllProducts,
  cartsDeleteProduct,
  cartsGet,
  cartsGetById,
  cartsPost,
  cartsPostProduct,
  cartsPurchase,
  cartsUpdateQuantity,
  // cartsUpdateAllProducts,
} from "../controllers/carts.controller.js";

export default class CartsRouter extends BaseRouter {
  init() {
    this.get("/", ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"], cartsGet);

    this.post("/", ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"], cartsPost);

    this.get(
      "/:id",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      cartsGetById
    );

    this.delete(
      "/:id",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      cartsDeleteAllProducts
    );

    this.post("/:id/purchase", ["USER_ROLE", "PREMIUN_ROLE"], cartsPurchase);

    this.post(
      "/:id/products/:pid",
      ["USER_ROLE", "PREMIUN_ROLE"],
      verifyMongoID,
      cartsPostProduct
    );

    this.put(
      "/:id/products/:pid",
      ["USER_ROLE", "PREMIUN_ROLE"],
      verifyMongoID,
      cartsUpdateQuantity
    );

    this.delete(
      "/:id/products/:pid",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      cartsDeleteProduct
    );
  }
}
