import BaseRouter from "./router.js";

import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

// import { generateProduct } from "../mocks/product.mock.js";

export default class ProductsRouter extends BaseRouter {
  init() {
    // this.get("/mockingproducts", ["USER_ROLE", "ADMIN_ROLE"], (req, res) => {
    //   let mockingProducts = [];
    //   for (let i = 0; i < 100; i++) {
    //     mockingProducts.push(generateProduct());
    //   }
    //   res.sendSuccessWithPayload(mockingProducts);
    // });

    this.get("/", ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"], getProducts);

    this.post("/", ["PREMIUM_ROLE", "ADMIN_ROLE"], createProduct);

    this.get(
      "/:id",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      getProductById
    );

    this.put(
      "/:id",
      ["PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      updateProduct
    );

    this.delete(
      "/:id",
      ["PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      deleteProduct
    );
  }
}
