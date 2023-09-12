import { addProductToCart, createRowOfProducts, btnLogoutListener } from "./functions.js";

/** Display products */
fetch("/api/products")
  .then((res) => res.json())
  .then((data) => {
    const products = data.payload;
    createRowOfProducts(products);

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

btnLogoutListener();
