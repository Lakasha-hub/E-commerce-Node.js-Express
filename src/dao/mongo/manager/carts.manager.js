import cartModel from "../models/cart.model.js";

export default class CartsManager {
  getCarts = () => {
    return cartModel.find().lean();
  };

  getCartById = (id) => {
    return cartModel.findById(id).lean();
  };

  createCart = (defaultCart) => {
    return cartModel.create(defaultCart);
  };

  addProductToCart = (id, product) => {
    return cartModel.findByIdAndUpdate(id, { $push: { products: product } });
  };

  updateProductOfCart = (id, product) => {
    return cartModel.findOneAndUpdate(
      { _id: id, "products.product": product.product },
      { $inc: { "products.$.quantity": product.quantity } }
    );
  };

  getProductOfCart = (id, pid) => {
    return cartModel.findOne({
      _id: id,
      products: { $elemMatch: { pid: pid } },
    });
  };

  deleteProductOfCart = (id, pid) => {
    return cartModel.findByIdAndUpdate(id, {
      $pull: { products: { product: pid } },
    });
  };

  updateAllProducts = (id, productsUpdated) => {
    return cartModel.findByIdAndUpdate(id, {
      $set: { products: productsUpdated },
    });
  };

  updateQuantityOfProduct = (id, pid, quantity) => {
    return cartModel.findOneAndUpdate(
      { _id: id, "products.product": pid },
      { $set: { "products.$.quantity": quantity } }
    );
  };

  deleteAllProducts = (id) => {
    return cartModel.findByIdAndUpdate(id, { $set: { products: [] } });
  };
}
