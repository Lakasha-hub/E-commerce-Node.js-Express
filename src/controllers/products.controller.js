import ProductsManager from "../dao/mongo/manager/products.manager.js";

const productManager = new ProductsManager();

const productsGet = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort,
    sortUpdated,
    query,
    queryUpdated,
  } = req.query;


  const baseUrl = `http://localhost:${process.env.PORT}/api/products/`
  let prevLink;
  let nextLink;

  if (!query) {
    const result = await productManager.getProducts(
      {},
      { limit: limit, page: page, sort: sortUpdated, lean: true }
    );

    result.hasPrevPage
      ? (prevLink = `${baseUrl}?limit=${limit}&page=${parseInt(page) - 1}&sort=${sort}`)
      : (prevLink = null);

    result.hasNextPage
      ? (nextLink = `${baseUrl}?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort}`)
      : (nextLink = null);

    return res.status(200).json({
      status: "Success",
      payload: result.docs,
      totalDocs: result.totalDocs,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  }

  const result = await productManager.getProducts(queryUpdated, {
    limit: limit,
    page: page,
    sort: sortUpdated,
    lean: true,
  });

  result.hasPrevPage
    ? (prevLink = `${baseUrl}?limit=${limit}&page=${parseInt(page) - 1}&sort=${sort}&query=${query}`)
    : (prevLink = null);

  result.hasNextPage
    ? (nextLink = `${baseUrl}?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort}&query=${query}`)
    : (nextLink = null);

  return res.status(200).json({
    status: "Success",
    payload: result.docs,
    totalDocs: result.totalDocs,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink,
    nextLink,
  });
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
