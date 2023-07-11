export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = (query, options) => {
    return this.dao.getProducts(query, options);
  };

  getProductBy = (param) => {
    return this.dao.getProductBy(param);
  };

  getProductById = (id) => {
    return this.dao.getProductById(id);
  };

  createProduct = (product) => {
    return this.dao.createProduct(product);
  };

  updateProduct = (id, properties) => {
    return this.dao.updateProduct(id, properties);
  };

  deleteProduct = (id) => {
    return this.dao.deleteProduct(id);
  };

  countDocuments = () => {
    return this.dao.countDocuments();
  };
}
