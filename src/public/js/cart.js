import {
  createRowOfProductsCarts,
  btnLogoutListener,
  chargeWithoutProducts,
  createSummary,
} from "./functions.js";

const url = new URL(window.location.href);
const cartId = url.pathname.split("/").pop();

const chargeProducts = () => {
  fetch(`/api/carts/${cartId}`)
    .then((response) => response.json())
    .then((data) => {
      const products = data.payload.products;

      if (products.length === 0) {
        return chargeWithoutProducts();
      }
      createRowOfProductsCarts(products);

      //If summary doesnt exists create one:
      const summaryExists = document.getElementById("summary");
      if (!summaryExists) {
        createSummary(cartId, products);
      } else {
        //but if exist delete and update
        summaryExists.remove();
        createSummary(cartId, products);
      }

      const productCards = document.querySelectorAll(".cardProduct");
      productCards.forEach((card) => {
        const stockElement = card.querySelector("#stock").innerHTML;
        const quantityElement = card.querySelector("#quantity").innerHTML;
        const btnsIncrement = card.querySelector(".incrementBtn");
        const btnsDecrement = card.querySelector(".decrementBtn");

        btnsIncrement.addEventListener("click", () => {
          const productId = btnsIncrement.id;
          fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "PUT",
            body: JSON.stringify({ operation: "sum", quantity: 1 }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              chargeProducts();
            });
        });
        btnsDecrement.addEventListener("click", () => {
          const productId = btnsDecrement.id;
          fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "PUT",
            body: JSON.stringify({ operation: "rest", quantity: 1 }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              chargeProducts();
            });
        });
        if (parseInt(quantityElement) === parseInt(stockElement)) {
          btnsIncrement.disabled = "disabled";
        }

        if (parseInt(quantityElement) === 1) {
          btnsDecrement.disabled = "disabled";
        }
      });
    })
    .catch((error) => console.log(error));
};

chargeProducts();
btnLogoutListener();
