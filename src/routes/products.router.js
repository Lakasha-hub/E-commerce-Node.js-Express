import { Router } from "express";

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

//Create instance of Router
const router = Router();

router.get("/", [validateGetQueryParams], productsGet);

router.post("/", [validateProductCamps, verifyCodeDuplicated], productsPost);

router.get("/:id", [verifyMongoID], productsGetById);

router.put("/:id", [verifyMongoID], productsPut);

router.delete("/:id", [verifyMongoID], productsDelete)

// router.delete("/:pid", async (req, res) => {
//   //Get Product ID for params
//   const { pid } = req.params;

//   //Call method deleteProduct
//   const product = await productManager.deleteProduct(pid);

//   //if catch error respond 400
//   if (typeof product == "string") {
//     return res.status(400).json({
//       msg: product, //error.message
//     });
//   }

//   //Send Products Updated to realTimeProducts with socket in req.io
//   const productsToView = await productManager.getProducts();
//   req.io.emit("GetProductsUpdated", productsToView);

//   return res.status(200).json({
//     msg: "The product has been removed",
//     product, //Product Deleted
//   });
// });

export default router;
