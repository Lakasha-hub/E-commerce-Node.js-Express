import ProductsManager from "../dao/mongo/manager/products.manager.js";

const productManager = new ProductsManager();

const productsGet = async (req, res) => {
  //Get query param Limit
  const { limit } = req.query;

  //If limit is not sent
  if (!limit) {
    //Return all products
    const products = await productManager.getProducts();
    return res.status(200).json({ payload: products });
  }

  const products = await productManager.getProducts().limit(limit);
  return res.status(200).json({ payload: products });
};

const productsPost = async (req, res) => {
  try {
    const { title, description, price, code, stock, category, thumbnails } =
      req.body;
    let newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbnails,
    };
    newProduct = await productManager.createProduct(newProduct);

    const productsToView = await productManager.getProducts();
    req.io.emit("GetProductsUpdated", productsToView);
    
    return res.status(201).json({
      msg: "New product created",
      payload: newProduct,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const productsGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productManager.getProductById(id);
    if (!result) {
      throw new Error(`There is not registered product with id: ${id}`);
    }
    return res.status(200).json({ payload: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const productsPut = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, ...properties } = req.body;

    const product_exists = await productManager.getProducts({ code: code });
    product_exists.forEach((p) => {
      if (p._id != id) {
        throw new Error(
          `The code: ${code} is already in use in another product`
        );
      }
    });

    await productManager.updateProduct(id, properties);
    const result = await productManager.getProductById(id);

    const productsToView = await productManager.getProducts();
    req.io.emit("GetProductsUpdated", productsToView);
    
    res.status(200).json({
      msg: "The product has been successfully updated",
      payload: result,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const productsDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productManager.getProductById(id);
    if (!result) {
      throw new Error(`There is no registered product with id: ${id}`);
    }

    await productManager.deleteProduct(id);
    const productsToView = await productManager.getProducts();
    req.io.emit("GetProductsUpdated", productsToView);

    return res.status(200).json({
      msg: "The product has been removed",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export {
  productsGet,
  productsPost,
  productsGetById,
  productsPut,
  productsDelete,
};
