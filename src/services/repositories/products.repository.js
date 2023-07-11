export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = (query, options) => {
    return this.dao.getProducts(query, options);
  };

  getOneProductBy = (param) => {
    return this.dao.getProductBy(param);
  };

  getProductById = (id) => {
    return this.dao.getProductById(id);
  };

  createProduct = (product) => {
    return this.dao.createProduct(product);
  };

  updateProductById = (id, properties) => {
    return this.dao.updateProduct(id, properties);
  };

  deleteProductById = (id) => {
    return this.dao.deleteProduct(id);
  };

  countEstimatedDocuments = () => {
    return this.dao.countDocuments();
  };
}
