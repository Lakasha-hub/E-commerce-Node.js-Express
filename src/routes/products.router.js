import { Router } from "express";
import ProductManager from "../models/products.model.js";

//Create instance of ProductManager
const productManager = new ProductManager();
//Create instance of Router
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  //Call file with Products
  let products = await productManager.getProducts();

  //Get query param Limit
  const { limit } = req.query;

  //Return all products if limit is not a number or is not sent
  if (isNaN(Number(limit))) {
    return res.status(200).json({ products });
  }

  //Return filtered products
  products = products.slice(0, Number(limit));
  return res.status(200).json({ products });
});

productsRouter.get("/:pid", async (req, res) => {
  //Get pid param
  const { pid } = req.params;

  //Find product
  const result = await productManager.getProductById(pid);
  //if not exists
  if (typeof result == "string") {
    return res.status(404).json({
      msg: result,
    });
  }
  return res.status(200).json({ result });
});

productsRouter.post("/", async (req, res) => {
  //Get product for body
  const { title, description, price, code, stock, category } = req.body;
  const newProduct = { title, description, price, code, stock, category };

  //Verify Required properties -- Middleware
  for (const propertie of Object.keys(newProduct)) {
    if (!newProduct[propertie]) {
      return res.status(400).json({
        msg: "Missing properties",
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

  return res.status(200).json({
    msg: "Product added correctly",
    product,
  });
});

productsRouter.put("/:pid", async (req, res) => {
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

productsRouter.delete("/:pid", async (req, res) => {
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
  return res.status(200).json({
    msg: "The product has been removed",
    product, //Product Deleted
  });
});

export default productsRouter;
