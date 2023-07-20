import { createRowOfProductsCarts } from "./functions.js";

const url = new URL(window.location.href);
const id = url.pathname.split("/").pop();

fetch(`/api/carts/${id}`)
  .then(async (response) => {
    const responseData = await response.json();
    if (responseData.error) throw new Error(responseData.error);
    return responseData;
  })
  .then((data) => {
    const products = data.payload.products;
    if (products.length === 0) {
      return Swal.fire({
        title: "There are not products",
        showConfirmButton: false,
        position: "top",
        timer: 1500,
      });
    }
    createRowOfProductsCarts(products);
  })
  .catch((error) => console.log(error));
