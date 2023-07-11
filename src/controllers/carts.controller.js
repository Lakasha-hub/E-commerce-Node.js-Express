import { cartsService, productsService } from "../services/repositories/index.js";
import { isValidObjectId } from "mongoose";

const cartsGet = async (req, res) => {
  const result = await cartsService.getCarts();
  return res.sendSuccessWithPayload(result);
};

const cartsPost = async (req, res) => {
  const defaultCart = {
    products: [],
  };
  const result = await cartsService.createCart(defaultCart);
  return res.sendCreatedWithPayload(result);
};

const cartsGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cartsService.getCartById(id);
    if (!result) {
      throw new Error(`There is no registered cart with id: ${id}`);
    }
    return res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendNotFound(error.message);
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

    const product_exists = await productsService.getProductById(pid);
    if (!product_exists) {
      throw new Error(`There is not registered product with id: ${pid}`);
    }

    const cart = await cartsService.getCartById(id);
    if (!cart) {
      throw new Error(`There is not registered cart with id: ${id}`);
    }

    const productExistsInCart = cart.products.find((p) => p.product == pid);

    if (!productExistsInCart) {
      await cartsService.addProductToCart(id, {
        product: pid,
        quantity,
      });
      const result = await cartsService.getCartById(id);
      return res.sendSuccessWithPayload(result);
    }

    await cartsService.updateProductOfCart(id, { product: pid, quantity });
    const result = await cartsService.getCartById(id);

    return res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendBadRequest(error.message);
  }
};

const cartsDeleteProduct = async (req, res) => {
  try {
    const { id, pid } = req.params;

    const verifyPid = isValidObjectId(pid);
    if (!verifyPid) {
      throw new Error(`The product id: ${pid} is not valid`);
    }

    const cart = await cartsService.getCartById(id);
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

    await cartsService.deleteProductOfCart(id, pid);
    return res.sendSuccess("Product has been Deleted");
  } catch (error) {
    return res.sendBadRequest(error.message);
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

    await cartsService.updateAllProducts(id, products);
    const result = await cartsService.getCartById(id);
    return res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendBadRequest(error.message);
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

    await cartsService.updateQuantityOfProduct(id, pid, quantity);
    const result = await cartsService.getCartById(id);
    return res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendBadRequest(error.message);
  }
};

const cartsDeleteAllProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartsService.getCartById(id);
    if (!cart) {
      throw new Error(`There is not registered cart with id: ${id}`);
    }

    if (cart.products.length == 0) {
      throw new Error(`the cart with id: ${id} has no products`);
    }
    await cartsService.deleteAllProducts(id);
    return res.sendSuccess(
      `All products in the cart with the id: ${id} have been removed`
    );
  } catch (error) {
    return res.sendBadRequest(error.message);
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
