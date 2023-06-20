import { createRowOfProducts } from "./functions.js";

let products;
fetch("/api/products/")
  .then((res) => res.json())
  .then((data) => {
    products = data.payload;
    createRowOfProducts(products);
  })
  .catch((error) => console.log(error));

const btn = document.querySelector(".btn-danger");
if (btn) {
  btn.addEventListener("click", () => {
    fetch("/api/sessions/logout")
      .then((response) => response.json())
      .then((data) => {
        window.location.replace("/login");
      })
      .catch((error) => console.log(error));
  });
}
