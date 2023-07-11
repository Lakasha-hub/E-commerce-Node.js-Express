import { productsService } from "../services/repositories/index.js";

const productsHandler = (io, socket) => {
  const getProductsUpdated = async () => {
    const result = await productsService.getProducts();
    io.emit("GetProductsUpdated", result);
  };

  socket.on("GetProducts", getProductsUpdated);
};

export default productsHandler;
