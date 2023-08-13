const invalidTypes = (quantity) => {
  return `One or more parameters were provided with an erroneous data type:
    Required type properties:
      * quantity: must be a number and was received ${typeof quantity}
      `;
};

const invalidValues = (quantity) => {
  return `One or more parameters were provided with an invalid values:
        Valid values for parameters:
        * quantity: must be 1 or more and was received ${quantity}`;
};

const invalidMongoId = (id) => {
  return `The parameter does not have an id format:
    Parameter:
    * id: must be a string with mongoDB format and was received ${id} `;
};

const notFoundCart = (id) => {
  return `No cart was found with the parameter provided:
    Parameter provided:
    * id: ${id}`;
};

const insuficientStock = (pid) => {
  return `Not enough stock for the requested product:
    * product id: ${pid}`;
};

const cartWithoutProducts = (id) => {
  return `The cart to be upgraded is empty:
    * cart id: ${id}`;
};

const notFoundProduct = (id, pid) => {
  return `The product was not found in the cart with the provided parameters:
    Parameters provided:
    * cart id: ${id}
    * product id: ${pid}`;
};

const carts_errors = {
  invalidTypes,
  notFoundCart,
  notFoundProduct,
  invalidValues,
  invalidMongoId,
  insuficientStock,
  cartWithoutProducts,
};

export default carts_errors;
