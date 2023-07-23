import { createRowOfProductsCarts } from "./functions.js";

const url = new URL(window.location.href);
const cartId = url.pathname.split("/").pop();

const chargeProducts = () => {
  fetch(`/api/carts/${cartId}`)
    .then((response) => response.json())
    .then((data) => {
      const products = data.payload.products;

      const amountCamp = document.querySelector("#totalAmount");
      let amount = 0;
      products.forEach((p) => {
        amount += p.quantity * p.product.price;
      });
      amountCamp.innerHTML = amount.toFixed(2);

      const productsQuantityCamp = document.querySelector("#quantitySummary");
      let quantity = 0;
      products.forEach((p) => {
        quantity += p.quantity;
      });
      productsQuantityCamp.innerHTML = quantity;

      if (products.length === 0) {
        return Swal.fire({
          title: "There are not products",
          showConfirmButton: false,
          position: "top",
          timer: 1500,
        });
      }
      createRowOfProductsCarts(products);

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

const purchaseBtn = document.querySelector("#purchaseBtn");
purchaseBtn.addEventListener("click", () => {
  Swal.fire({
    title: "Do you want to finalize the purchase?",
    showCancelButton: true,
    confirmButtonText: "Purchase",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())

        //Purchase Completed
        .then((data) => {
          return Swal.fire({
            title: "Purchase Completed!",
            showCancelButton: false,
            imageHeigh: 300,
            icon: "success",
            showCloseButton: true,
            html: `
            <b>Purchaser</b>: ${data.payload.purchaser}
            <br>
            <b>Date of purchase</b>: ${data.payload.purchase_datetime}
            <br>
            <b>Total</b>: ${data.payload.amount}
            <br>
            <br>
            You can see details in your Profile - my purchases`,
          }).then((result) => {
            location.reload();
          });
        })
        .catch((error) => console.log(error));
    }
  });
});
