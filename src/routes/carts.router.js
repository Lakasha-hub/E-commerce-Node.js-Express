import { Router } from "express";

import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";
import {
  cartsGet,
  cartsGetById,
  cartsPost,
  cartsPostProduct,
} from "../controllers/carts.controller.js";

//Create instance of Router
const router = Router();

router.get("/", cartsGet);

router.post("/", cartsPost);

router.get("/:id", [verifyMongoID], cartsGetById);

router.post("/:id/product/:pid", [verifyMongoID], cartsPostProduct);

export default router;
