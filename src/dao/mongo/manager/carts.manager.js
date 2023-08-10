import cartModel from "../models/cart.model.js";

export default class CartsManager {
  getCarts = () => {
    return cartModel.find().lean();
  };

  getCartById = (id) => {
    return cartModel.findById(id).lean();
  };

  createCart = () => {
    return cartModel.create({ products: [] });
  };

  addProductToCart = (id, product) => {
    return cartModel.findByIdAndUpdate(id, { $push: { products: product } });
  };

  updateProductOfCart = (id, product) => {
    return cartModel.findOneAndUpdate(
      { _id: id, "products.product": product.product },
      { $set: { "products.$.quantity": product.quantity } }
    );
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

  deleteAllProducts = (id) => {
    return cartModel.findByIdAndUpdate(id, { $set: { products: [] } });
  };
}
