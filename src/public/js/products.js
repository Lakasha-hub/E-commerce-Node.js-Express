import { addProductToCart, createRowOfProducts } from "./functions.js";

/** Display products */
fetch("/api/products")
  .then((res) => res.json())
  .then((data) => {
    const products = data.payload;
    createRowOfProducts(products.payload);

    /** Create listeners to products */
    fetch("/api/sessions/current")
      .then((res) => res.json())
      .then((data) => {
        const cartId = data.payload.cart;
        addProductToCart(cartId);
      });
  })
  .catch((error) => console.log(error));

/** Welcome message */
fetch("/api/sessions/current")
  .then((response) => response.json())
  .then((data) => {
    return Swal.fire({
      title: `Welcome ${data.payload.name}, check these products`,
      showCancelButton: false,
      showConfirmButton: false,
      position: "top",
      timer: 1500,
    });
  })
  .catch((error) => console.log(error));

/**Log out */
const btnLogOut = document.querySelector("#logout");
if (btnLogOut) {
  btnLogOut.addEventListener("click", () => {
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
