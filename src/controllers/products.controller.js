import { productsService } from "../services/repositories/index.js";

import { ErrorManager } from "../constants/errors/index.js";
import environmentOptions from "../constants/server/environment.options.js";
import ErrorService from "../services/error.service.js";
import { v4 as uuidv4 } from "uuid";

const PORT = environmentOptions.app.PORT;

const productsGet = async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    if (typeof limit !== "number" || typeof page !== "number") {
      ErrorService.create({
        name: "Error when requesting products",
        cause: ErrorManager.products.invalidTypesPaginate({
          limit,
          page,
          sort,
        }),
        code: ErrorManager.codes.INVALID_TYPES,
        message: "There are params with wrong data types",
        status: 400,
      });
    }

    if (limit <= 0 || page <= 0) {
      ErrorService.create({
        name: "Error when requesting products",
        cause: ErrorManager.products.invalidValuesPaginate({
          limit,
          page,
          sort,
        }),
        code: ErrorManager.codes.INVALID_VALUES,
        message: "There are params with invalid values",
        status: 400,
      });
    }

    const documentsCount = await productsService.countDocuments();
    if (limit > documentsCount) {
      limit = 10;
    }

    let queryUpdated;
    if (query) {
      const filter = query.split(":");
      const key = filter[0].trim();
      let value = filter[1].trim();
      if (typeof parseInt(value) === "number" && !isNaN(parseInt(value)))
        value = parseInt(value);
      queryUpdated = { [key]: value };
    }

    if (sort && sort !== "asc" && sort !== "desc") {
      ErrorService.create({
        name: "Error when requesting products",
        cause: ErrorManager.products.invalidValuesPaginate({
          limit,
          page,
          sort,
        }),
        code: ErrorManager.codes.INVALID_VALUES,
        message: "There are params with invalid values",
        status: 400,
      });
    }

    if (!sort) {
      sort = "asc";
    }

    const baseUrl = `http://localhost:${PORT}/api/products/`;
    let prevLink;
    let nextLink;

    if (!query) {
      const result = await productsService.getAll(
        {},
        { limit, page, sort: { price: sort }, lean: true }
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

    const result = await productsService.getAll(queryUpdated, {
      limit,
      page,
      sort: { price: sort },
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
    return res.sendError(error);
  }
};

const productsPost = async (req, res) => {
  try {
    const { title, description, price, stock, category, thumbnails } = req.body;

    let newProduct = {
      title,
      description,
      price,
      stock,
      category,
      thumbnails,
    };

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof stock !== "number" ||
      typeof category !== "string" ||
      !Array.isArray(thumbnails)
    ) {
      ErrorService.create({
        name: "Error when creating a new product",
        cause: ErrorManager.products.invalidTypes(newProduct),
        code: ErrorManager.codes.INVALID_TYPES,
        message: "There are fields with wrong data types",
        status: 400,
      });
    }

    for (const propertie of Object.keys(newProduct)) {
      if (!newProduct[propertie]) {
        ErrorService.create({
          name: "Error when creating a new product",
          cause: ErrorManager.products.incompleteValues(newProduct),
          code: ErrorManager.codes.INCOMPLETE_VALUES,
          message: "There are incomplete fields",
          status: 400,
        });
      }
    }

    const product_exists = await productsService.getBy({ title });
    if (product_exists) {
      ErrorService.create({
        name: "Error when creating a new product",
        cause: ErrorManager.products.duplicated(title),
        code: ErrorManager.codes.DUPLICATED,
        message: "Product already exists",
        status: 409,
      });
    }

    let code;
    let codeExists;
    do {
      code = uuidv4();
      codeExists = await productsService.getBy({ code });
    } while (codeExists);

    newProduct.code = code;
    newProduct = await productsService.create(newProduct);

    const productsToView = await productsService.getAll();
    req.io.emit("GetProductsUpdated", productsToView);

    return res.sendCreated("New product created");
  } catch (error) {
    return res.sendError(error);
  }
};

const productsGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsService.getById(id);
    if (!product) {
      ErrorService.create({
        name: "Error when requesting a product",
        cause: ErrorManager.products.notFound(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered product with id: ${id}`,
        status: 404,
      });
    }
    return res.sendSuccessWithPayload(product);
  } catch (error) {
    return res.sendError(error);
  }
};

const productsPut = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...properties } = req.body;

    const product_exists = await productsService.getById(id);
    if (product_exists) {
      ErrorService.create({
        name: "Error when updating a product",
        cause: ErrorManager.products.duplicated(id),
        code: ErrorManager.codes.DUPLICATED,
        message: "Product already exists",
        status: 409,
      });
    }

    await productsService.updateById(id, properties);
    const result = await productsService.getById(id);

    const productsToView = await productsService.getAll();
    req.io.emit("GetProductsUpdated", productsToView);

    res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendError(error);
  }
};

const productsDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const product_exists = await productsService.getById(id);
    if (!product_exists) {
      ErrorService.create({
        name: "Error deleting a product",
        cause: ErrorManager.products.notFound(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered product with id: ${id}`,
        status: 404,
      });
    }

    await productsService.deleteById(id);
    const productsToView = await productsService.getAll();
    req.io.emit("GetProductsUpdated", productsToView);

    return res.sendSuccess("The product has been removed");
  } catch (error) {
    return res.sendError(error);
  }
};

export {
  productsGet,
  productsPost,
  productsGetById,
  productsPut,
  productsDelete,
};
