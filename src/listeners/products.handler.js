import ProductsManager from "../dao/mongo/manager/products.manager.js";

const productManager = new ProductsManager();

const productsHandler = (io, socket) => {
  const getProductsUpdated = async () => {
    const result = await productManager.getProducts();
    io.emit("GetProductsUpdated", result);
  };

  socket.on("GetProducts", getProductsUpdated);
};

export default productsHandler;
