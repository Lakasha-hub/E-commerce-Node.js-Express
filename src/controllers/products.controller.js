import { productsService } from "../services/repositories/index.js";
import "dotenv/config";

const PORT = process.env.PORT;

const productsGet = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      sortUpdated,
      query,
      queryUpdated,
    } = req.query;

    const baseUrl = `http://localhost:${PORT}/api/products/`;
    let prevLink;
    let nextLink;

    if (!query) {
      const result = await productsService.getProducts(
        {},
        { limit: limit, page: page, sort: sortUpdated, lean: true }
      );

      result.hasPrevPage
        ? (prevLink = `${baseUrl}?limit=${limit}&page=${
            parseInt(page) - 1
          }&sort=${sort}`)
        : (prevLink = null);

      result.hasNextPage
        ? (nextLink = `${baseUrl}?limit=${limit}&page=${
            parseInt(page) + 1
          }&sort=${sort}`)
        : (nextLink = null);

      return res.sendSuccessWithPayload({
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

    const result = await productsService.getProducts(queryUpdated, {
      limit: limit,
      page: page,
      sort: sortUpdated,
      lean: true,
    });

    result.hasPrevPage
      ? (prevLink = `${baseUrl}?limit=${limit}&page=${
          parseInt(page) - 1
        }&sort=${sort}&query=${query}`)
      : (prevLink = null);

    result.hasNextPage
      ? (nextLink = `${baseUrl}?limit=${limit}&page=${
          parseInt(page) + 1
        }&sort=${sort}&query=${query}`)
      : (nextLink = null);

    return res.sendSuccessWithPayload({
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
  } catch (error) {
    console.log(error);
    return res.sendBadRequest(error.message);
  }
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
    newProduct = await productsService.createProduct(newProduct);

    const productsToView = await productsService.getProducts();
    req.io.emit("GetProductsUpdated", productsToView);

    return res.sendCreated("New product created");
  } catch (error) {
    return res.sendBadRequest(error.message);
  }
};

const productsGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productsService.getProductById(id);
    if (!result) {
      throw new Error(`There is not registered product with id: ${id}`);
    }
    return res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendBadRequest(error.message);
  }
};

const productsPut = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, ...properties } = req.body;

    const product_exists = await productsService.getProducts({ code: code });
    product_exists.forEach((p) => {
      if (p._id != id) {
        throw new Error(
          `The code: ${code} is already in use in another product`
        );
      }
    });

    await productsService.updateProduct(id, properties);
    const result = await productsService.getProductById(id);

    const productsToView = await productsService.getProducts();
    req.io.emit("GetProductsUpdated", productsToView);

    res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendBadRequest(error.message);
  }
};

const productsDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productsService.getProductById(id);
    if (!result) {
      throw new Error(`There is no registered product with id: ${id}`);
    }

    await productsService.deleteProduct(id);
    const productsToView = await productsService.getProducts();
    req.io.emit("GetProductsUpdated", productsToView);

    return res.sendSuccess("The product has been removed");
  } catch (error) {
    return res.sendBadRequest(error.message);
  }
};

export {
  productsGet,
  productsPost,
  productsGetById,
  productsPut,
  productsDelete,
};
