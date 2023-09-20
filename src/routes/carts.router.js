import BaseRouter from "./router.js";

import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";

import {
  getCarts,
  getCartById,
  createCart,
  addProduct,
  deleteProduct,
  clearCart,
  purchase,
  updateQuantityOfProduct,
  updateProducts,
} from "../controllers/carts.controller.js";

export default class CartsRouter extends BaseRouter {
  init() {
    this.get("/", ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"], getCarts);

    this.post("/", ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"], createCart);

    this.get(
      "/:id",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      getCartById
    );

    this.put(
      "/:id",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      updateProducts
    );

    this.delete(
      "/:id",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      clearCart
    );

    this.post(
      "/:id/products/:pid",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      addProduct
    );

    this.put(
      "/:id/products/:pid",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      updateQuantityOfProduct
    );

    this.delete(
      "/:id/products/:pid",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      deleteProduct
    );

    this.post(
      "/:id/purchase",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      purchase
    );
  }
}
