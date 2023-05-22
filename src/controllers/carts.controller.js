import { isValidObjectId } from "mongoose";
import CartsManager from "../dao/mongo/manager/carts.manager.js";
import ProductsManager from "../dao/mongo/manager/products.manager.js";

const cartManager = new CartsManager();

const cartsGet = async (req, res) => {
  const result = await cartManager.getCarts();
  return res.status(200).json({ payload: result });
};

const cartsPost = async (req, res) => {
  const defaultCart = {
    products: [],
  };
  const result = await cartManager.createCart(defaultCart);
  return res.status(201).json({
    msg: "The Cart has been successfully created",
    payload: result,
  });
};

const cartsGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cartManager.getCartById(id);
    if (!result) {
      throw new Error(`There is no registered cart with id: ${id}`);
    }
    return res.status(200).json({ payload: result });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const cartsPostProduct = async (req, res) => {
  try {
    const { id, pid } = req.params;
    let { quantity } = req.body;

    if (!quantity) {
      quantity = 1;
    }

    if (typeof quantity !== "number") {
      throw new Error("quantity must be type Number");
    }

    const verifyPid = isValidObjectId(pid);
    if (!verifyPid) {
      throw new Error(`The product id: ${pid} is not valid`);
    }

    const productManager = new ProductsManager();
    const product_exists = await productManager.getProductById(pid);
    if (!product_exists) {
      throw new Error(`There is not registered product with id: ${pid}`);
    }

    const cart = await cartManager.getCartById(id);
    const productExistsInCart = cart.products.find((p) => p._id == pid);
    if (!productExistsInCart) {
      await cartManager.addProductToCart(id, {
        _id: pid,
        quantity,
      });
      const result = await cartManager.getCartById(id);
      return res
        .status(200)
        .json({ payload: result, msg: "product not exists" });
    }
    await cartManager.updateProductOfCart(id, { _id: pid, quantity });

    // const productUpdated = {
    //   pid: productExistsInCart.pid,
    //   quantity: productExistsInCart.quantity,
    // };
    // await cartManager.addProductToCart(id, productUpdated);
    const result = await cartManager.getCartById(id);
    return res.status(200).json({ payload: result, msg: "product exist" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { cartsGet, cartsPost, cartsGetById, cartsPostProduct };
