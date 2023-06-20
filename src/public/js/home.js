import { createViewOfProducts } from "./functions.js";

let products;
fetch("/api/products/")
  .then((res) => res.json())
  .then((data) => {
    products = data.payload;
    createViewOfProducts(products);
  })
  .catch((error) => console.log(error));
