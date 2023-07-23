import {
  cartsService,
  productsService,
  ticketsService,
} from "../services/repositories/index.js";
import { isValidObjectId } from "mongoose";
import { generateCodeRandom } from "../utils.js";

const cartsGet = async (req, res) => {
  const result = await cartsService.getAll();
  return res.sendSuccessWithPayload(result);
};

const cartsPost = async (req, res) => {
  const result = await cartsService.create();
  return res.sendCreatedWithPayload(result);
};

const cartsGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cartsService.getById(id);
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

    if (typeof quantity !== "number") {
      throw new Error("quantity must be type Number");
    }

    if (quantity <= 0) {
      throw new Error("quantity must be 1 or more");
    }

    if (!quantity) {
      quantity = 1;
    }

    const verifyPid = isValidObjectId(pid);
    if (!verifyPid) {
      throw new Error(`The product id: ${pid} is not valid`);
    }

    const product_exists = await productsService.getById(pid);
    if (!product_exists) {
      throw new Error(`There is not registered product with id: ${pid}`);
    }

    const cart = await cartsService.getById(id);
    if (!cart) {
      throw new Error(`There is not registered cart with id: ${id}`);
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

    const cart = await cartsService.getById(id);
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

    await cartsService.deleteProduct(id, pid);
    return res.sendSuccess("Product has been Deleted");
  } catch (error) {
    return res.sendBadRequest(error.message);
  }
};

const cartsPurchase = async (req, res) => {
  try {
    //Get Cart Id
    const { id } = req.params;
    const { email } = req.user;
    const cart = await cartsService.getById(id);

    let amount = 0;
    cart.products.forEach((product) => {
      if (product.quantity > product.product.stock) {
        throw new Error("Insuficient Stock");
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
    return res.sendBadRequest(error.message);
  }
};

// const cartsUpdateAllProducts = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const products = req.body;

//     products.forEach((p) => {
//       if (!isValidObjectId(p.product)) {
//         throw new Error(`${p.product} is not a valid product id`);
//       }
//       if (!p.quantity) {
//         p.quantity = 1;
//       }
//       if (typeof p.quantity !== "number") {
//         throw new Error("quantity must be type Number");
//       }
//     });

//     await cartsService.updateAllProducts(id, products);
//     const result = await cartsService.getCartById(id);
//     return res.sendSuccessWithPayload(result);
//   } catch (error) {
//     return res.sendBadRequest(error.message);
//   }
// };

const cartsUpdateQuantity = async (req, res) => {
  try {
    const { id, pid } = req.params;
    const { quantity, operation } = req.body;

    if (!isValidObjectId(pid)) {
      throw new Error(`${pid} is not a valid product id`);
    }

    if (typeof quantity !== "number") {
      throw new Error("quantity must be type Number");
    }

    if (quantity <= 0) throw new Error("quantity must be 1 or more");

    const cart = await cartsService.getById(id);
    const productDb = cart.products.find(
      (p) => p.product._id.toString() === pid
    );

    if (operation == "sum") {
      productDb.quantity = productDb.quantity + quantity;
    } else if (operation == "rest") {
      productDb.quantity = productDb.quantity - quantity;
    }

    if (productDb.quantity === 0) {
      await cartsService.deleteProduct(id, pid);
      return res.sendSuccess("Product deleted");
    }

    if (productDb.quantity > productDb.product.stock)
      throw new Error("Insuficient stock");

    await cartsService.updateProduct(id, productDb);
    return res.sendSuccess("Product updated");
  } catch (error) {
    console.log(error);
    return res.sendBadRequest(error.message);
  }
};

const cartsDeleteAllProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartsService.getById(id);
    if (!cart) {
      throw new Error(`There is not registered cart with id: ${id}`);
    }

    if (cart.products.length == 0) {
      throw new Error(`the cart with id: ${id} has no products`);
    }
    await cartsService.clear(id);
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
  cartsDeleteAllProducts,
  cartsPurchase,
  cartsUpdateQuantity,
  // cartsUpdateAllProducts,
};
