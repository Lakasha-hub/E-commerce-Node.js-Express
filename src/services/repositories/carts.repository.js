export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = () => {
    return this.dao.getCarts();
  };

  getById = (id) => {
    return this.dao.getCartById(id);
  };

  create = () => {
    return this.dao.createCart([]);
  };

  addProduct = (id, product) => {
    return this.dao.addProductToCart(id, product);
  };

  // getProduct = (id, pid) => {
  //   return this.dao.getProductOfCart(id, pid);
  // };

  updateProduct = (id, product) => {
    return this.dao.updateProductOfCart(id, product);
  };

  updateAllProducts = (id, products) => {
    return this.dao.updateAllProducts(id, products);
  };

  deleteProduct = (id, pid) => {
    return this.dao.deleteProductOfCart(id, pid);
  };

  clear = (id) => {
    return this.dao.deleteAllProducts(id);
  };
}
