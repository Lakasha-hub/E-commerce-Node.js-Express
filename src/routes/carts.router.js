import { Router } from "express";
import CartsManager from "../models/carts.model.js";
import ProductManager from "../models/products.model.js";

//Create instance of CartsManager
const cartsManager = new CartsManager();
//Create instance of Router
const router = Router();

router.get("/:cid", async (req, res) => {
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

router.post("/", async (req, res) => {
  const cart = await cartsManager.createCart();
  return res.status(200).json({
    msg: "The Cart has been successfully created",
    cart,
  });
});

router.post("/:cid/product/:pid", async (req, res) => {
  //Get cid and pid param
  const { cid, pid } = req.params;
  const { quantity } = req.body;

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
  const cart = await cartsManager.addProductToCart(cid, pid, quantity);
  //If there is an error
  if (typeof cart == "string") {
    return res.status(404).json({
      msg: cart, //error.message
    });
  }
  return res.status(200).json({
    msg: 'Product/s added correctly',
    cart, 
  });

});

export default router;
