import { Router } from "express";
import ProductManager from "../models/products.model.js";

//Create instance of ProductManager
const productManager = new ProductManager();
//Create instance of Router
const router = Router();

router.get("/", async (req, res) => {
  //Call file with Products
  let products = await productManager.getProducts();

  //Get query param Limit
  const { limit } = req.query;

  //If limit is not sent
  if (!limit) {
    //Return all products
    return res.status(200).json({ products });
  }

  //Verify limit is a valid number
  if (limit <= 0 || isNaN(limit) || limit > products.length) {
    return res.status(400).json({
      msg: "limit is not a valid number",
    });
  }

  //Return filtered products
  products = products.slice(0, Number(limit));
  return res.status(200).json({ products });
});

router.get("/:pid", async (req, res) => {
  //Get pid param
  const { pid } = req.params;
  //Find product
  const product = await productManager.getProductById(pid);
  //if catch error respond 400
  if (typeof product == "string") {
    return res.status(400).json({
      msg: product, //error.message
    });
  }
  return res.status(200).json({ product });
});

router.post("/", async (req, res) => {
  //Get product for body
  const {
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
    status,
  } = req.body;
  const newProduct = {
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
    status,
  };

  //Verify Required properties -- Middleware
  for (const propertie of Object.keys(newProduct)) {
    //Except not required properties
    if (propertie == "thumbnails" || propertie == "status") continue;
    if (!newProduct[propertie]) {
      return res.status(400).json({
        msg: `Missing propertie: ${propertie}`,
      });
    }
  }

  //Call method addProduct
  const product = await productManager.addProduct(newProduct);
  //if catch error respond 400
  if (typeof product == "string") {
    return res.status(400).json({
      msg: product, //error.message
    });
  }

  //Send Products to realTimeProducts with socket in req.io
  const productsToView = await productManager.getProducts();
  req.io.emit("GetProductsUpdated", productsToView);

  return res.status(200).json({
    msg: "Product added correctly",
    product,
  });
});

router.put("/:pid", async (req, res) => {
  //Get Product ID for params
  const { pid } = req.params;
  //Get properties from body
  const { ...properties } = req.body;

  //Call method updateProduct
  const product = await productManager.updateProduct(pid, properties);
  //if catch error respond 400
  if (typeof product == "string") {
    return res.status(400).json({
      msg: product, //error.message
    });
  }
  return res.status(200).json({
    msg: "The product has been successfully updated",
    product,
  });
});

router.delete("/:pid", async (req, res) => {
  //Get Product ID for params
  const { pid } = req.params;

  //Call method deleteProduct
  const product = await productManager.deleteProduct(pid);

  //if catch error respond 400
  if (typeof product == "string") {
    return res.status(400).json({
      msg: product, //error.message
    });
  }

  //Send Products Updated to realTimeProducts with socket in req.io
  const productsToView = await productManager.getProducts();
  req.io.emit("GetProductsUpdated", productsToView);

  return res.status(200).json({
    msg: "The product has been removed",
    product, //Product Deleted
  });
});

export default router;
