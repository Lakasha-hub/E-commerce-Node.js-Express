import { createRowOfProductsCarts } from "./functions.js";

const url = new URL(window.location.href);
const id = url.pathname.split("/").pop();

let cart;
fetch(`/api/carts/${id}`)
  .then(async (response) => {
    const responseData = await response.json();
    if (responseData.error) throw new Error(responseData.error);
    return responseData;
  })
  .then((data) => {
    cart = data.payload;
    createRowOfProductsCarts(cart.products);
  })
  .catch((error) => console.log(error));
