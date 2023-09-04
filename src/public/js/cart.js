import {
  createRowOfProductsCarts,
  btnLogoutListener,
  chargeWithoutProducts,
  createSummary,
  updateSummary,
  purchase,
  saveProducts,
  updateProducts,
  chargeProducts,
} from "./functions.js";

const url = new URL(window.location.href);
const cartId = url.pathname.split("/").pop();

fetch(`/api/carts/${cartId}`)
  .then((response) => {
    if (response.status === 404 || response.status === 400) {
      throw new Error("Cart not exists");
    }
    if (response.status === 500) {
      throw new Error("Internal Error");
    }
    return response.json();
  })
  .then((data) => {
    const products = data.payload.products;

    if (products.length === 0) {
      return chargeWithoutProducts();
    }
    createRowOfProductsCarts(products);
    createSummary();

    const productsInStorage = localStorage.getItem("p");
    if (!productsInStorage) {
      updateSummary();
    } else {
      updateProducts();
      updateSummary();
    }

    saveProducts();

    const purchaseBtn = document.querySelector("#purchaseBtn");
    purchaseBtn.addEventListener("click", () => {
      chargeProducts(cartId)
      purchase(cartId);
    });
  })
  .catch((error) => {
    Swal.fire({
      title: error.message,
      showCancelButton: true,
      showConfirmButton: false,
    });
  });

btnLogoutListener();
