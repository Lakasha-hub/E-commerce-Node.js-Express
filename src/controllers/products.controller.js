import { isValidObjectId } from "mongoose";

import {
  productsService,
  usersService,
} from "../services/repositories/index.js";
import MailingService from "../services/mailing.service.js";
import mailsTemplates from "../constants/mails/mails.templates.js";

import environmentOptions from "../constants/server/environment.options.js";
import { ErrorManager } from "../constants/errors/index.js";
import ErrorService from "../services/error.service.js";
import ProductMailing from "../dtos/product/product..mailing.js";
import { generateRandomString } from "../utils.js";

const PORT = environmentOptions.app.PORT;

const getProducts = async (req, res) => {
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

      return res.status(200).json({
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

    return res.status(200).json({
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

const createProduct = async (req, res) => {
  try {
    const { title, desc, price, stock, category, thumbnails } = req.body;

    const newProduct = {
      title,
      desc,
      price,
      stock,
      category,
      thumbnails,
    };

    if (req.user.id !== 0) {
      const isValidId = isValidObjectId(req.user.id);
      if (!isValidId) {
        ErrorService.create({
          name: "Error when creating a product",
          cause: ErrorManager.products.invalidOwner(owner),
          code: ErrorManager.codes.INVALID_VALUES,
          message: `The id: ${req.user.id} is not valid`,
          status: 400,
        });
      }
      newProduct.owner = req.user.id;
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

    if (
      typeof title !== "string" ||
      typeof desc !== "string" ||
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
      code = generateRandomString(10);
      codeExists = await productsService.getBy({ code });
    } while (codeExists);

    newProduct.code = code;
    await productsService.create(newProduct);

    const productsToView = await productsService.getAll();
    req.io.emit("GetProductsUpdated", productsToView);

    return res.sendCreated("New product created");
  } catch (error) {
    return res.sendError(error);
  }
};

const getProductById = async (req, res) => {
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

const updateProduct = async (req, res) => {
  try {
    // product id
    const { id } = req.params;
    // updated properties
    const { title, desc, price, stock, category, thumbnails } = req.body;

    const propertiesFromBody = {
      title,
      desc,
      price,
      stock,
      category,
      thumbnails,
    };

    let propertiesUpdated = {};
    for (const key in propertiesFromBody) {
      if (propertiesFromBody[key]) {
        propertiesUpdated[key] = propertiesFromBody[key];
      }
    }

    const product = await productsService.getById(id);
    if (!product) {
      ErrorService.create({
        name: "Error when updating a product",
        cause: ErrorManager.products.notFound(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered product with id: ${id}`,
        status: 404,
      });
    }

    if (req.user.role === "PREMIUM_ROLE" && product.owner !== req.user.id) {
      ErrorService.create({
        name: "Error when creating a product",
        cause: ErrorManager.products.notAuthorized(product.owner, req.user.id),
        code: ErrorManager.codes.UNAUTHORIZED,
        message: "You cannot alter the product because you do not own it",
        status: 401,
      });
    }

    await productsService.updateById(id, propertiesUpdated);
    const result = await productsService.getById(id);

    const productsToView = await productsService.getAll();
    req.io.emit("GetProductsUpdated", productsToView);

    res.sendSuccessWithPayload(result);
  } catch (error) {
    return res.sendError(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    // product id
    const { id } = req.params;

    const product = await productsService.getById(id);
    if (!product) {
      ErrorService.create({
        name: "Error deleting a product",
        cause: ErrorManager.products.notFound(id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered product with id: ${id}`,
        status: 404,
      });
    }

    if (req.user.role === "PREMIUM_ROLE" && product.owner !== req.user.id) {
      ErrorService.create({
        name: "Error when creating a product",
        cause: ErrorManager.products.notAuthorized(product.owner, req.user.id),
        code: ErrorManager.codes.UNAUTHORIZED,
        message: "You cannot alter the product because you do not own it",
        status: 401,
      });
    }

    await productsService.deleteById(id);
    if (product.owner !== "admin") {
      const owner = await usersService.getBy({ _id: product.owner });
      //Send an email to advice user
      const mailingService = new MailingService();
      const productMailing = ProductMailing.getFrom(product);
      await mailingService.sendMail(
        owner.email,
        mailsTemplates.DELETED_PRODUCT,
        { product: productMailing }
      );
    }

    const productsToView = await productsService.getAll();
    req.io.emit("GetProductsUpdated", productsToView);

    return res.sendSuccess("The product has been removed");
  } catch (error) {
    return res.sendError(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
