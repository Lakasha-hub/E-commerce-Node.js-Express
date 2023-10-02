export default class ProductMailing {
  static getFrom = (product) => {
    return {
      title: product.title,
      price: product.price,
    };
  };
}
