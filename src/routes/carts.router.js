import { Router } from "express";

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

//Create instance of Router
const router = Router();

router.get("/", cartsGet);

router.post("/", cartsPost);

router.get("/:id", [verifyMongoID], cartsGetById);

router.put("/:id", [verifyMongoID], cartsUpdateAllProducts);

router.delete("/:id", [verifyMongoID], cartsDeleteAllProducts);

router.post("/:id/products/:pid", [verifyMongoID], cartsPostProduct);

router.put("/:id/products/:pid", [verifyMongoID], cartsUpdateQuantity);

router.delete("/:id/products/:pid", [verifyMongoID], cartsDeleteProduct);

export default router;
