export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCarts = () => {
    return this.dao.getCarts();
  };

  getCartById = (id) => {
    return this.dao.getCartById(id);
  };

  createCart = () => {
    return this.dao.createCart();
  };

  addProductToCart = (id, product) => {
    return this.dao.addProductToCart(id, product);
  };

  updateProductOfCart = (id, product) => {
    return this.dao.updateProductOfCart(id, product);
  };

  getProductOfCart = (id, pid) => {
    return this.dao.getProductOfCart(id, pid);
  };

  deleteProductOfCart = (id, pid) => {
    return this.dao.deleteProductOfCart(id, pid);
  };

  updateQuantityOfProduct = (id, pid, quantity) => {
    return this.dao.updateQuantityOfProduct(id, pid, quantity);
  };

  updateAllProducts = (id, productsUpdated) => {
    return this.dao.updateAllProducts(id, productsUpdated);
  };

  deleteAllProducts = (id) => {
    return this.dao.deleteAllProducts(id);
  };
}
