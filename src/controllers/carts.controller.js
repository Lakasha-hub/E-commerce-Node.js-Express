import { isValidObjectId } from "mongoose";

import {
  cartsService,
  productsService,
  ticketsService,
} from "../services/repositories/index.js";

import ErrorService from "../services/error.service.js";
import { ErrorManager } from "../constants/errors/index.js";

import MailingService from "../services/mailing.service.js";
import TicketMailing from "../dtos/ticket/ticket.mailing.js";
import mailsTemplates from "../constants/mails/mails.templates.js";
import { generateRandomString } from "../utils.js";

const getCarts = async (req, res) => {
  const carts = await cartsService.getAll();
  return res.sendSuccessWithPayload(carts);
};

const createCart = async (req, res) => {
  const newCart = await cartsService.create();
  return res.sendCreatedWithPayload(newCart);
};

const getCartById = async (req, res) => {
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

const addProduct = async (req, res) => {
  try {
    const { id, pid } = req.params;
    let { quantity = 1 } = req.body;

    if (!isValidObjectId(pid)) {
      ErrorService.create({
        name: "Error when adding a product",
        cause: ErrorManager.carts.invalidMongoId(pid),
        code: ErrorManager.codes.INVALID_TYPES,
        message: `The product id: ${pid} is not valid`,
        status: 400,
      });
    }

    if (typeof quantity !== "number") {
      ErrorService.create({
        name: "Error when adding a product",
        cause: ErrorManager.carts.invalidTypes(quantity),
        code: ErrorManager.codes.INVALID_TYPES,
        message: "The quantity parameter must be a number type",
        status: 400,
      });
    }

    if (quantity <= 0) {
      ErrorService.create({
        name: "Error when adding a product",
        cause: ErrorManager.carts.invalidValues(quantity),
        code: ErrorManager.codes.INVALID_VALUES,
        message: "The quantity parameter must be 1 or more",
        status: 400,
      });
    }

    const product = await productsService.getById(pid);
    if (!product) {
      ErrorService.create({
        name: "Error when adding a product",
        cause: ErrorManager.products.notFound(pid),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered product with id: ${pid}`,
        status: 404,
      });
    }

    const cart = await cartsService.getById(id);
    if (!cart) {
      ErrorService.create({
        name: "Error when adding a product",
        cause: ErrorManager.carts.notFoundCart(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered cart with id: ${id}`,
        status: 404,
      });
    }

    if (req.user.role === "PREMIUM_ROLE" && product.owner === req.user.id) {
      ErrorService.create({
        name: "Error when adding a product",
        cause: ErrorManager.carts.notAuthorized(),
        code: ErrorManager.codes.UNAUTHORIZED,
        message: "you cannot acquire a product you own",
        status: 400,
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

const deleteProduct = async (req, res) => {
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

const purchase = async (req, res) => {
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
          cause: ErrorManager.carts.insuficientStock(product.product._id),
          code: ErrorManager.codes.INSUFICIENT_STOCK,
          message: `Insufficient stock for the product with the id: ${product.product._id}`,
          status: 409,
        });
      }
      amount += product.quantity * product.product.price;
    });

    let code;
    let codeExists;
    do {
      code = generateRandomString(10);
      codeExists = await ticketsService.getBy({ code });
    } while (codeExists);

    const ticket = await ticketsService.create({
      code,
      amount: amount.toFixed(2),
      purchaser: email,
    });
    await cartsService.clear(id);

    const ticketMailing = TicketMailing.getFrom(ticket);
    const mailingService = new MailingService();
    await mailingService.sendMail(email, mailsTemplates.PURCHASE, {
      ticket: ticketMailing,
    });

    return res.sendSuccessWithPayload(ticket);
  } catch (error) {
    console.log(error);
    return res.sendError(error);
  }
};

const updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { products } = req.body;

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

    products.forEach(async (product) => {
      if (typeof product.quantity !== "number") {
        ErrorService.create({
          name: "Error updating a product in a cart",
          cause: ErrorManager.carts.invalidTypes(product.quantity),
          code: ErrorManager.codes.INVALID_TYPES,
          message: "The quantity parameter must be a number type",
          status: 400,
        });
      }

      if (product.quantity <= 0) {
        ErrorService.create({
          name: "Error updating a product in a cart",
          cause: ErrorManager.carts.invalidValues(product.quantity),
          code: ErrorManager.codes.INVALID_VALUES,
          message: "The quantity parameter must be 1 or more",
          status: 400,
        });
      }

      if (!isValidObjectId(product.product)) {
        ErrorService.create({
          name: "Error updating a product in a cart",
          cause: ErrorManager.carts.invalidMongoId(product.product),
          code: ErrorManager.codes.INVALID_TYPES,
          message: `The product id: ${product.product} is not valid`,
          status: 400,
        });
      }

      const productInCart = cart.products.find(
        (p) => p.product._id.toString() === product.product
      );
      if (!productInCart) {
        ErrorService.create({
          name: "Error updating a product in a cart",
          cause: ErrorManager.carts.notFoundProduct(id, product.product),
          code: ErrorManager.codes.NOT_FOUND,
          message: `There is not registered product with id: ${product.product} in cart with id: ${id}`,
          status: 404,
        });
      }

      if (product.quantity > productInCart.product.stock) {
        ErrorService.create({
          name: "Error updating a product in a cart",
          cause: ErrorManager.carts.insuficientStock(product.product),
          code: ErrorManager.codes.INSUFICIENT_STOCK,
          message: `Insufficient stock for the product with the id: ${product.product}`,
          status: 409,
        });
      }

      await cartsService.updateProduct(id, product);
    });

    return res.sendSuccess("Products Updated");
  } catch (error) {
    return res.sendError(error);
  }
};

const updateQuantityOfProduct = async (req, res) => {
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
    return res.sendError(error);
  }
};

const clearCart = async (req, res) => {
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
  getCarts,
  getCartById,
  createCart,
  addProduct,
  deleteProduct,
  clearCart,
  purchase,
  updateQuantityOfProduct,
  updateProducts,
};
