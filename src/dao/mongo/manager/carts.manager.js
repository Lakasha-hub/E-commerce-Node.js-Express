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
      { _id: id, "products._id": product._id },
      { $inc: { "products.$.quantity": product.quantity } }
    );
  };

  getProductOfCart = (id, pid) => {
    return cartModel.findOne({
      _id: id,
      products: { $elemMatch: { pid: pid } },
    });
  };
}
