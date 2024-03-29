const incompleteValues = (product) => {
  return `One or more parameters were not provided:
    Required properties:
    * title: must be a string and was received ${product.title}
    * desc: must be a string and was received ${product.desc}
    * price: must be a number and was received ${product.price}
    * category: must be a string and was received ${product.category}
    * stock: must be a number and was received ${product.stock}
    * thumbnails: must be an array of strings and was received ${product.thumbnails}`;
};

const invalidTypes = (product) => {
  return `One or more parameters were provided with an erroneous data type:
  Required type properties:
    * title: must be a string and was received ${typeof product.title}
    * desc: must be a string and was received ${typeof product.desc}
    * price: must be a number and was received ${typeof product.price}
    * category: must be a string and was received ${typeof product.category}
    * stock: must be a number and was received ${typeof product.stock}
    * thumbnails: must be an array of strings and was received ${typeof product.thumbnails}`;
};

const duplicated = (id) => {
  return `The product with the sent parameters is already registered:
  Parameters sent:
  * id: ${id}`;
};

const notFound = (id) => {
  return `No product was found with the parameter provided:
  Parameter provided:
  * id: ${id}`;
};

const invalidTypesPaginate = (paginateParams) => {
  return `One or more parameters were provided with an erroneous data type:
    Required type properties:
    * limit: must be a number and was received ${typeof paginateParams.limit}
    * sort: must be a string and was received ${typeof paginateParams.sort}
    * page: must be a number and was received ${typeof paginateParams.page}`;
};

const invalidValuesPaginate = (paginateParams) => {
  return `One or more parameters were provided with an invalid values:
      Valid values for parameters:
      * limit: must be 1 or more and was received ${paginateParams.limit}
      * sort: must be "asc" or "desc" and was received ${paginateParams.sort}
      * page: must be 1 or more and was received ${paginateParams.page}`;
};

const notAuthorized = (owner, client) => {
  return `To alter the products you must be their owner:
  Parameter received:
  * owner id: ${owner}
  * client id: ${client}`;
};

const invalidOwner = (owner) => {
  return `Owner must be an object ID:
  Parameter received:
  * owner: ${owner}`;
};

const products_errors = {
  invalidTypesPaginate,
  invalidValuesPaginate,
  incompleteValues,
  invalidTypes,
  duplicated,
  notFound,
  notAuthorized,
  invalidOwner,
};

export default products_errors;
