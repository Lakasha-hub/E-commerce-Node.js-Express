export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = (query, options) => {
    return this.dao.getProducts(query, options);
  };

  getBy = (param) => {
    return this.dao.getProductBy(param);
  };

  getById = (id) => {
    return this.dao.getProductById(id);
  };

  create = (product) => {
    return this.dao.createProduct(product);
  };

  updateById = (id, properties) => {
    return this.dao.updateProduct(id, properties);
  };

  deleteById = (id) => {
    return this.dao.deleteProduct(id);
  };

  countDocuments = () => {
    return this.dao.countDocuments();
  };
}
