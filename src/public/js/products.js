import { createRowOfProducts } from "./functions.js";

let products;
fetch("/api/products/")
  .then((res) => res.json())
  .then((data) => {
    products = data.payload;
    createRowOfProducts(products);
  })
  .catch((error) => console.log(error));

// const buttons = document.querySelectorAll(".btn .btn-primary");
// buttons.forEach((btn) => {
//   btn.addEventListener("click", () => {
    

//     fetch("/api/carts/:id/products/:pid")
//     .then()
//   });
// });
