import { createRowOfProductsCarts } from "./functions.js";

const url = new URL(window.location.href);
const id = url.pathname.split("/").pop();

let cart;
fetch(`/api/carts/${id}`)
  .then((res) => res.json())
  .then((data) => {
    cart = data.payload;
    createRowOfProductsCarts(cart.products);
  })
  .catch((error) => console.log(error));
