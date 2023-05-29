import productModel from "../models/product.model.js";

export default class ProductsManager {
  getProducts = (query, options) => {
    return productModel.paginate(query, options)
  };

  getProductBy = (param) => {
    return productModel.findOne(param).lean();
  };

  getProductById = (id) => {
    return productModel.findById(id).lean();
  };

  createProduct = (product) => {
    return productModel.create(product);
  };

  updateProduct = (id, properties) => {
    return productModel.findByIdAndUpdate(id, { $set: properties });
  };

  deleteProduct = (id) => {
    return productModel.findByIdAndDelete(id);
  };

  countDocuments = () => {
    return productModel.estimatedDocumentCount();
  };
}
