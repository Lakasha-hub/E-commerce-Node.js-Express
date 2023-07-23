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

  // getProductOfCart = (id, pid) => {
  //   return cartModel.findOne({
  //     _id: id,
  //     products: { $elemMatch: { product : pid} },
  //   });
  // };

  deleteProductOfCart = (id, pid) => {
    return cartModel.findByIdAndUpdate(id, {
      $pull: { products: { product: pid } },
    });
  };

  // updateQuantityOfProduct = (id, pid, quantity) => {
  //   return cartModel.findOneAndUpdate(
  //     { _id: id, "products.product": pid },
  //     { $set: { "products.$.quantity": quantity } }
  //   );
  // };

  updateAllProducts = (id, productsUpdated) => {
    return cartModel.findByIdAndUpdate(id, {
      $set: { products: productsUpdated },
    });
  };

  deleteAllProducts = (id) => {
    return cartModel.findByIdAndUpdate(id, { $set: { products: [] } });
  };
}
