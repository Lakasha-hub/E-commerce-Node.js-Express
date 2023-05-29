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
    if (!cart) {
      throw new Error(`There is not registered cart with id: ${id}`);
    }

    const productExistsInCart = cart.products.find((p) => p.product == pid);

    if (!productExistsInCart) {
      await cartManager.addProductToCart(id, {
        product: pid,
        quantity,
      });
      const result = await cartManager.getCartById(id);
      return res
        .status(200)
        .json({ payload: result, msg: "product not exists" });
    }

    await cartManager.updateProductOfCart(id, { product: pid, quantity });
    const result = await cartManager.getCartById(id);

    return res.status(200).json({ payload: result, msg: "product exist" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cartsDeleteProduct = async (req, res) => {
  try {
    const { id, pid } = req.params;

    const verifyPid = isValidObjectId(pid);
    if (!verifyPid) {
      throw new Error(`The product id: ${pid} is not valid`);
    }

    const cart = await cartManager.getCartById(id);
    if (!cart) {
      throw new Error(`There is not registered cart with id: ${id}`);
    }
    const productExistsInCart = cart.products.find(
      (p) => p.product._id.toString() == pid
    );
    if (!productExistsInCart) {
      throw new Error(
        `There is not registered product with id: ${pid} in cart with id: ${id}`
      );
    }

    await cartManager.deleteProductOfCart(id, pid);
    return res.status(200).json({ msg: "Product has been Deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cartsUpdateAllProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = req.body;

    products.forEach((p) => {
      if (!isValidObjectId(p.product)) {
        throw new Error(`${p.product} is not a valid product id`);
      }
      if (!p.quantity) {
        p.quantity = 1;
      }
      if (typeof p.quantity !== "number") {
        throw new Error("quantity must be type Number");
      }
    });

    await cartManager.updateAllProducts(id, products);
    const result = await cartManager.getCartById(id);
    return res
      .status(200)
      .json({ msg: "Products Updated Succesfully", payload: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cartsUpdateQuantity = async (req, res) => {
  try {
    const { id, pid } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(pid)) {
      throw new Error(`${pid} is not a valid product id`);
    }

    if (!quantity) {
      throw new Error("quantity is required");
    }

    if (typeof quantity !== "number") {
      throw new Error("quantity must be type Number");
    }

    await cartManager.updateQuantityOfProduct(id, pid, quantity);
    const result = await cartManager.getCartById(id);
    return res
      .status(200)
      .json({ msg: "Product Updated Successfully", payload: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cartsDeleteAllProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartManager.getCartById(id);
    if (!cart) {
      throw new Error(`There is not registered cart with id: ${id}`);
    }

    if(cart.products.length == 0){
      throw new Error(`the cart with id: ${id} has no products`)
    }
    await cartManager.deleteAllProducts(id);
    return res.status(200).json({
      msg: `All products in the cart with the id: ${id} have been removed`,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
export {
  cartsGet,
  cartsPost,
  cartsGetById,
  cartsPostProduct,
  cartsDeleteProduct,
  cartsUpdateQuantity,
  cartsDeleteAllProducts,
  cartsUpdateAllProducts,
};
