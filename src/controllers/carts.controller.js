import {
  cartsService,
  productsService,
  ticketsService,
} from "../services/repositories/index.js";
import { isValidObjectId } from "mongoose";
import { generateCodeRandom } from "../utils.js";

import ErrorService from "../services/error.service.js";
import { ErrorManager } from "../constants/index.js";
import { pid } from "process";

const cartsGet = async (req, res) => {
  const carts = await cartsService.getAll();
  return res.sendSuccessWithPayload(carts);
};

const cartsPost = async (req, res) => {
  const newCart = await cartsService.create();
  return res.sendCreatedWithPayload(newCart);
};

const cartsGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartsService.getById(id);
    if (!cart) {
      ErrorService.create({
        name: "Error requesting a cart",
        cause: ErrorManager.carts.notFoundCart(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered cart with id: ${id}`,
        status: 404,
      });
    }
    return res.sendSuccessWithPayload(cart);
  } catch (error) {
    return res.sendError(error);
  }
};

const cartsPostProduct = async (req, res) => {
  try {
    const { id, pid } = req.params;
    let { quantity = 1 } = req.body;

    if (!isValidObjectId(pid)) {
      ErrorService.create({
        name: "Error when creating a product",
        cause: ErrorManager.carts.invalidMongoId(pid),
        code: ErrorManager.codes.INVALID_TYPES,
        message: `The product id: ${pid} is not valid`,
        status: 400,
      });
    }

    if (typeof quantity !== "number") {
      ErrorService.create({
        name: "Error when creating a product",
        cause: ErrorManager.carts.invalidTypes(quantity),
        code: ErrorManager.codes.INVALID_TYPES,
        message: "The quantity parameter must be a number type",
        status: 400,
      });
    }

    if (quantity <= 0) {
      ErrorService.create({
        name: "Error when creating a product",
        cause: ErrorManager.carts.invalidValues(quantity),
        code: ErrorManager.codes.INVALID_VALUES,
        message: "The quantity parameter must be 1 or more",
        status: 400,
      });
    }

    const product_exists = await productsService.getById(pid);
    if (!product_exists) {
      ErrorService.create({
        name: "Error when requesting a product",
        cause: ErrorManager.products.notFound(pid),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered product with id: ${pid}`,
        status: 404,
      });
    }

    const cart = await cartsService.getById(id);
    if (!cart) {
      ErrorService.create({
        name: "Error requesting a cart",
        cause: ErrorManager.carts.notFoundCart(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered cart with id: ${id}`,
        status: 404,
      });
    }

    const productExistsInCart = cart.products.find(
      (p) => p.product._id.toString() === pid
    );

    if (!productExistsInCart) {
      await cartsService.addProduct(id, {
        product: pid,
        quantity,
      });
      const result = await cartsService.getById(id);
      return res.sendSuccessWithPayload(result);
    }

    await cartsService.updateProduct(id, {
      product: pid,
      quantity: productExistsInCart.quantity + quantity,
    });

    const result = await cartsService.getById(id);
    return res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendError(error);
  }
};

const cartsDeleteProduct = async (req, res) => {
  try {
    const { id, pid } = req.params;

    if (!isValidObjectId(pid)) {
      ErrorService.create({
        name: "Error when removing a product from a cart",
        cause: ErrorManager.carts.invalidMongoId(pid),
        code: ErrorManager.codes.INVALID_TYPES,
        message: `The product id: ${pid} is not valid`,
        status: 400,
      });
    }

    const cart = await cartsService.getById(id);
    if (!cart) {
      ErrorService.create({
        name: "Error when removing a product from a cart",
        cause: ErrorManager.carts.notFoundCart(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered cart with id: ${id}`,
        status: 404,
      });
    }

    const productExistsInCart = cart.products.find(
      (p) => p.product._id.toString() == pid
    );
    if (!productExistsInCart) {
      ErrorService.create({
        name: "Error when removing a product from a cart",
        cause: ErrorManager.carts.notFoundProduct(id, pid),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is not registered product with id: ${pid} in cart with id: ${id}`,
        status: 404,
      });
    }

    await cartsService.deleteProduct(id, pid);
    return res.sendSuccess("Product has been Deleted");
  } catch (error) {
    return res.sendError(error);
  }
};

const cartsPurchase = async (req, res) => {
  try {
    //Get Cart Id
    const { id } = req.params;
    const { email } = req.user;

    const cart = await cartsService.getById(id);
    if (!cart) {
      ErrorService.create({
        name: "Error in the purchase process",
        cause: ErrorManager.carts.notFoundCart(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered cart with id: ${id}`,
        status: 404,
      });
    }

    let amount = 0;
    cart.products.forEach((product) => {
      if (product.quantity > product.product.stock) {
        ErrorService.create({
          name: "Error in the purchase process",
          cause: ErrorManager.carts.insuficientStock(pid),
          code: ErrorManager.codes.INSUFICIENT_STOCK,
          message: `Insufficient stock for the product with the id: ${pid}`,
          status: 409,
        });
      }
      amount += product.quantity * product.product.price;
    });

    let code;
    let flag = true;
    while (flag) {
      code = generateCodeRandom(20);
      const codeExists = await ticketsService.getBy({ code });
      if (!codeExists) {
        flag = false;
      }
    }

    const ticket = await ticketsService.create({
      code,
      amount: amount.toFixed(2),
      purchaser: email,
    });
    await cartsService.clear(id);

    return res.sendSuccessWithPayload(ticket);
  } catch (error) {
    console.log(error);
    return res.sendError(error);
  }
};

const cartsUpdateQuantity = async (req, res) => {
  try {
    const { id, pid } = req.params;
    const { quantity, operation } = req.body;

    if (!isValidObjectId(pid)) {
      ErrorService.create({
        name: "Error updating a product in a cart",
        cause: ErrorManager.carts.invalidMongoId(pid),
        code: ErrorManager.codes.INVALID_TYPES,
        message: `The product id: ${pid} is not valid`,
        status: 400,
      });
    }

    if (typeof quantity !== "number") {
      ErrorService.create({
        name: "Error updating a product in a cart",
        cause: ErrorManager.carts.invalidTypes(quantity),
        code: ErrorManager.codes.INVALID_TYPES,
        message: "The quantity parameter must be a number type",
        status: 400,
      });
    }

    if (quantity <= 0) {
      ErrorService.create({
        name: "Error updating a product in a cart",
        cause: ErrorManager.carts.invalidValues(quantity),
        code: ErrorManager.codes.INVALID_VALUES,
        message: "The quantity parameter must be 1 or more",
        status: 400,
      });
    }

    const cart = await cartsService.getById(id);

    if (!cart) {
      ErrorService.create({
        name: "Error updating a product in a cart",
        cause: ErrorManager.carts.notFoundCart(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered cart with id: ${id}`,
        status: 404,
      });
    }

    const productDb = cart.products.find(
      (p) => p.product._id.toString() === pid
    );

    if (!productDb) {
      ErrorService.create({
        name: "Error updating a product in a cart",
        cause: ErrorManager.carts.notFoundProduct(id, pid),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is not registered product with id: ${pid} in cart with id: ${id}`,
        status: 404,
      });
    }

    if (operation == "sum") {
      productDb.quantity = productDb.quantity + quantity;
    } else if (operation == "rest") {
      productDb.quantity = productDb.quantity - quantity;
    }

    if (productDb.quantity === 0) {
      await cartsService.deleteProduct(id, pid);
      return res.sendSuccess("Product deleted");
    }

    if (productDb.quantity > productDb.product.stock) {
      ErrorService.create({
        name: "Error updating a product in a cart",
        cause: ErrorManager.carts.insuficientStock(pid),
        code: ErrorManager.codes.INSUFICIENT_STOCK,
        message: `Insufficient stock for the product with the id: ${pid}`,
        status: 409,
      });
    }

    await cartsService.updateProduct(id, productDb);
    return res.sendSuccess("Product updated");
  } catch (error) {
    console.log(error);
    return res.sendError(error);
  }
};

const cartsDeleteAllProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartsService.getById(id);
    if (!cart) {
      ErrorService.create({
        name: "Error updating products in the cart",
        cause: ErrorManager.carts.notFoundCart(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered cart with id: ${id}`,
        status: 404,
      });
    }

    if (cart.products.length == 0) {
      ErrorService.create({
        name: "Error updating products in the cart",
        cause: ErrorManager.carts.cartWithoutProducts(id),
        code: ErrorManager.codes.WITHOUT_PRODUCTS,
        message: `the cart with id: ${id} has no products`,
        status: 409,
      });
    }

    await cartsService.clear(id);
    return res.sendSuccess(
      `All products in the cart with the id: ${id} have been removed`
    );
  } catch (error) {
    return res.sendError(error);
  }
};
export {
  cartsGet,
  cartsPost,
  cartsGetById,
  cartsPostProduct,
  cartsDeleteProduct,
  cartsDeleteAllProducts,
  cartsPurchase,
  cartsUpdateQuantity,
};
