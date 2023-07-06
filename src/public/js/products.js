import { createRowOfProducts } from "./functions.js";

let products;
fetch("/api/products")
  .then((res) => res.json())
  .then((data) => {
    products = data.payload;
    createRowOfProducts(products.payload);
  })
  .catch((error) => console.log(error));

const btn = document.querySelector(".btn-danger");
if (btn) {
  btn.addEventListener("click", () => {
    return Swal.fire({
      title: "Want to log out?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("/api/sessions/logout")
          .then((response) => {
            if (response.error) throw new Error(response.error);
            return response;
          })
          .then((data) => {
            window.location.replace("/login");
          })
          .catch((error) => console.log(error));
      }
    });
  });
}
