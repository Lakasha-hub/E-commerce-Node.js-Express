import { Router } from "express";
import CartsManager from "../models/carts.model.js";
import ProductManager from "../models/products.model.js";

//Create instance of CartsManager
const cartsManager = new CartsManager();
//Create instance of Router
const cartsRouter = Router();

cartsRouter.get("/:cid", async (req, res) => {
  //Get cid param
  const { cid } = req.params;

  //find Cart
  const cart = await cartsManager.getCartById(cid);
  //if not exist
  if (typeof cart == "string") {
    return res.status(404).json({
      msg: cart, //error.message
    });
  }
  return res.status(200).json({ cart });
});

cartsRouter.post("/", async (req, res) => {
  const cart = await cartsManager.createCart();
  return res.status(200).json({
    msg: "The Cart has been successfully created",
    cart,
  });
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  //Get cid and pid param
  const { cid, pid } = req.params;

  //Create instance of product manager to verify pid is valid
  const productManager = new ProductManager();

  //Verify pid exists
  const productValid = await productManager.getProductById(pid);
  //if catch error respond 400
  if (typeof productValid == "string") {
    return res.status(400).json({
      msg: productValid, // Error.message from getProductById
    });
  }

  //Call method addProductToCart
  const cart = await cartsManager.addProductToCart(cid, pid);
  //If there is an error
  if (typeof cart == "string") {
    return res.status(404).json({
      msg: cart, //error.message
    });
  }
  return res.status(200).json({
    cart, 
  });

});

export default cartsRouter;
