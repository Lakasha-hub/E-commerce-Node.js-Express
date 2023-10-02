const createRowOfProducts = (products) => {
  //Father Element
  const rowBody = document.querySelector(".row.row-cols-1.row-cols-md-4.g-4");

  //For Each Product => create Card
  products.forEach((element) => {
    const column = document.createElement("div");
    column.classList.add("col");
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("h-100");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    //Add Card information
    cardBody.innerHTML = `<h5>${element.title}</h5>
      <p class="card-text">Description:${element.desc}</p>
      <p class="card-text">Price:${element.price}</p>
      <button type="button" class="btn btn-primary" id="${element._id}">Add To Cart</button>
      `;
    card.appendChild(cardBody);
    column.appendChild(card);
    rowBody.appendChild(column);
  });
};

const createViewOfProducts = (products) => {
  //Father Element
  const rowBody = document.querySelector(".row.row-cols-1.row-cols-md-4.g-4");

  //For Each Product => create Card
  products.forEach((element) => {
    const column = document.createElement("div");
    column.classList.add("col");
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("h-100");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    //Add Card information
    cardBody.innerHTML = `<h5>${element.title}</h5>
      <p class="card-text">Description:${element.desc}</p>
      <p class="card-text">Price:${element.price}</p>
      <p class="card-text">Code:${element.code}</p>
      <p class="card-text">Stock:${element.stock}</p>
      <p class="card-text">Category:${element.category}</p>
      <p class="card-text">Status:${element.status}</p>
      <p class="card-text">Thumbnails:${element.thumbnails}</p>
      <p class="card-text">Id:${element._id}</p>
      `;

    card.appendChild(cardBody);
    column.appendChild(card);
    rowBody.appendChild(column);
  });
};

const createViewOfMessages = (messages) => {
  const messagesBody = document.querySelector(".messages");

  messages.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("w-50");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    cardBody.innerHTML = `${element.user}:
    ${element.message}`;

    card.appendChild(cardBody);
    messagesBody.appendChild(card);
  });
};

//list from products of cart
const createRowOfProductsCarts = (products) => {
  //Father Element
  const rowProducts = document.querySelector("#rowProducts");
  rowProducts.innerHTML = "";

  //For Each Product => create Card
  products.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("mb-2");
    card.classList.add("cardProduct");
    const cardBody = document.createElement("div");
    card.classList.add("card-body");

    //Add Card information
    cardBody.innerHTML = `<h5 class="card-title">${element.product.title}</h5>
      <p class="card-text">Price per unit: <span id="price">${element.product.price}</span></p>
      <p class="card-text">Units:<span id="quantity">${element.quantity}</span></p>
      <button class="btn btn-dark decrementBtn" id="${element.product._id}">-</button>
      <button class="btn btn-dark incrementBtn" id="${element.product._id}">+</button>
      <p class="card-subtitle mt-2 text-body-secondary"><span id="stock">${element.product.stock}</span> available</p>
      `;

    card.appendChild(cardBody);
    rowProducts.appendChild(card);

    const btnsIncrement = card.querySelector(".incrementBtn");
    const btnsDecrement = card.querySelector(".decrementBtn");
    const stockProduct = card.querySelector("#stock").innerHTML;

    btnsIncrement.addEventListener("click", () => {
      const quantityElement = card.querySelector("#quantity");
      quantityElement.innerHTML = parseInt(quantityElement.innerHTML) + 1;
      if (parseInt(quantityElement.innerHTML) === parseInt(stockProduct)) {
        btnsIncrement.disabled = "disabled";
      } else if (parseInt(quantityElement.innerHTML) < parseInt(stockProduct)) {
        btnsIncrement.disabled = "";
      }

      if (parseInt(quantityElement.innerHTML) === 1) {
        btnsDecrement.disabled = "disabled";
      } else if (parseInt(quantityElement.innerHTML) > 1) {
        btnsDecrement.disabled = "";
      }
      updateSummary();
      saveProducts();
    });
    btnsDecrement.addEventListener("click", () => {
      const quantityElement = card.querySelector("#quantity");
      quantityElement.innerHTML = parseInt(quantityElement.innerHTML) - 1;
      if (parseInt(quantityElement.innerHTML) === parseInt(stockProduct)) {
        btnsIncrement.disabled = "disabled";
      } else if (parseInt(quantityElement.innerHTML) < parseInt(stockProduct)) {
        btnsIncrement.disabled = "";
      }

      if (parseInt(quantityElement.innerHTML) === 1) {
        btnsDecrement.disabled = "disabled";
      } else if (parseInt(quantityElement.innerHTML) > 1) {
        btnsDecrement.disabled = "";
      }
      updateSummary();
      saveProducts();
    });
  });
};

const saveProducts = () => {
  localStorage.removeItem("p");
  const cardsProducts = document.querySelectorAll(".cardProduct");
  let filteredProducts = [];
  cardsProducts.forEach((product) => {
    const productId = product.querySelector(".incrementBtn").id;
    const quantityProduct = product.querySelector("#quantity").innerHTML;
    const finalProduct = {
      quantity: parseInt(quantityProduct),
      id: productId,
    };
    filteredProducts.push(finalProduct);
  });

  localStorage.setItem("p", JSON.stringify(filteredProducts));
};

const updateProducts = () => {
  const cardsProducts = document.querySelectorAll(".cardProduct");
  const productsFromStorage = JSON.parse(localStorage.getItem("p"));
  cardsProducts.forEach((product) => {
    const btnsIncrement = product.querySelector(".incrementBtn");
    const btnsDecrement = product.querySelector(".decrementBtn");
    const stockProduct = product.querySelector("#stock").innerHTML;
    const productId = product.querySelector(".incrementBtn").id;
    const quantityProduct = product.querySelector("#quantity");
    const productStorage = productsFromStorage.find(
      (p) => p.id.toString() === productId
    );
    quantityProduct.innerHTML = productStorage.quantity;
    if (parseInt(quantityProduct.innerHTML) === parseInt(stockProduct)) {
      btnsIncrement.disabled = "disabled";
    }

    if (parseInt(quantityProduct.innerHTML) === 1) {
      btnsDecrement.disabled = "disabled";
    }
  });
};

const chargeProducts = (cartId) => {
  const products = JSON.parse(localStorage.getItem("p"));
  let filteredProducts = [];
  products.forEach((product) => {
    const productId = product.id;
    const quantityProduct = product.quantity;
    const finalProduct = {
      quantity: parseInt(quantityProduct),
      product: productId,
    };
    filteredProducts.push(finalProduct);
  });
  fetch(`/api/carts/${cartId}`, {
    method: "PUT",
    body: JSON.stringify({ products: filteredProducts }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.removeItem("p");
    })
    .catch((error) => {
      Swal.fire({
        title: error.message,
        showCancelButton: true,
        showConfirmButton: false,
      });
    });
};

const createSummary = () => {
  const rowCart = document.querySelector(".row");

  const col = document.createElement("div");
  col.classList.add("col-md-4");
  col.setAttribute("id", "summary");
  const card = document.createElement("div");
  card.classList.add("card");
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  cardBody.innerHTML = `<h5 class="card-title">Summary</h5>
  <p>Total: <span id="totalAmount"></span></p>
  <p>Products: <span id="quantitySummary"></span></p>
  <button class="btn btn-primary" id="purchaseBtn">Purchase</button>`;

  card.appendChild(cardBody);
  col.appendChild(card);
  rowCart.appendChild(col);
};

const updateSummary = () => {
  const cardsProducts = document.querySelectorAll(".cardProduct");
  const amountCamp = document.querySelector("#totalAmount");
  const productsQuantityCamp = document.querySelector("#quantitySummary");

  let amount = 0;
  let quantitySummary = 0;
  cardsProducts.forEach((product) => {
    const btnsIncrement = product.querySelector(".incrementBtn");
    const btnsDecrement = product.querySelector(".decrementBtn");
    const quantityProduct = product.querySelector("#quantity").innerHTML;
    const stockProduct = product.querySelector("#stock").innerHTML;

    quantitySummary += parseFloat(quantityProduct);

    amount +=
      parseFloat(product.querySelector("#price").innerHTML) * quantityProduct;

    if (parseInt(quantityProduct) === parseInt(stockProduct)) {
      btnsIncrement.disabled = "disabled";
    }

    if (parseInt(quantityProduct) === 1) {
      btnsDecrement.disabled = "disabled";
    }
  });

  amountCamp.innerHTML = amount.toFixed(2);
  productsQuantityCamp.innerHTML = quantitySummary;
};

const purchase = (cartId) => {
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
        .then((res) => {
          if (res.status === 400) {
            throw new Error("Error while trying to checkout");
          }
          if (res.status === 404) {
            throw new Error("Cart not exists");
          }
          if (res.status === 409) {
            throw new Error("Some products are out of stock");
          }
          if (res.status === 500) {
            throw new Error("Internal Error");
          }
          return res.json();
        })
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
        .catch((error) => {
          Swal.fire({
            title: error.message,
            showCancelButton: true,
            showConfirmButton: false,
          });
        });
    }
  });
};

const addProductToCart = (cartId) => {
  const buttonsAddToCart = document.querySelectorAll(".btn");
  buttonsAddToCart.forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.id;
      fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        body: JSON.stringify({ quantity: 1 }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      Swal.fire({
        title: "Product Added correctly",
        position: "top-end",
        timer: 1000,
        width: "20rem",
        showCancelButton: false,
        showConfirmButton: false,
      });
    });
  });
};

const btnLogoutListener = () => {
  const btnLogOut = document.querySelector("#logout");
  if (btnLogOut) {
    btnLogOut.addEventListener("click", () => {
      return Swal.fire({
        title: "Want to log out?",
        confirmButtonColor: "#B40404",
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
            .catch((error) => {
              Swal.fire({
                title: error.message,
                showCancelButton: true,
                showConfirmButton: false,
              });
            });
        }
      });
    });
  }
};

const chargeWithoutProducts = () => {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert");
  alertDiv.classList.add("text-center");

  alertDiv.innerHTML = `<p>Cart is empty</p>
  <p><a href="/products">discover products</a></p>`;

  document.body.appendChild(alertDiv);
};

const clearCookie = (cookieName) => {
  document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const createRowOfUsers = (users) => {
  //Father Element
  const rowBody = document.querySelector(".row.row-cols-1.row-cols-md-4.g-4");

  //For Each User => create Card
  users.forEach((element) => {
    const column = document.createElement("div");
    column.classList.add("col");
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("h-100");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    //Add Card information
    cardBody.innerHTML = `<h5>${element.name}</h5>
      <p class="card-text">role: ${element.role}</p>
      <p class="card-text">email: ${element.email}</p>
      <button type="button" class="btn btn-primary" id="${element.id}">Change role</button>
      <button type="button" class="btn btn-danger" id="${element.id}">Delete</button>
      `;
    card.appendChild(cardBody);
    column.appendChild(card);
    rowBody.appendChild(column);
  });
};

const changeRoleToButton = () => {
  const btns_changeRole = document.querySelectorAll(".btn-primary");
  btns_changeRole.forEach((element) => {
    element.addEventListener("click", () => {
      return Swal.fire({
        title: "Are you sure you want to change the user role?",
        confirmButtonColor: "#B40404",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const userId = element.id;
          fetch(`/api/users/premium/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              response.json();
            })
            .then((data) => {
              location.reload();
            })
            .catch((error) => {
              Swal.fire({
                title: error.message,
                showCancelButton: true,
                showConfirmButton: false,
              });
              console.log(error);
            });
        }
      });
    });
  });
};
const deleteUserToButton = () => {
  const btns_delete = document.querySelectorAll(".btn-danger");
  btns_delete.forEach((element) => {
    element.addEventListener("click", () => {
      return Swal.fire({
        title: "Are you sure you want to delete this user?",
        confirmButtonColor: "#B40404",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const userId = element.id;
          fetch(`/api/users/${userId}`, {
            method: "DELETE",
          })
            .then((response) => {
              response.json();
            })
            .then((data) => {
              location.reload();
            })
            .catch((error) => {
              Swal.fire({
                title: error.message,
                showCancelButton: true,
                showConfirmButton: false,
              });
              console.log(error);
            });
        }
      });
    });
  });
};

export {
  createRowOfProducts,
  createViewOfProducts,
  createViewOfMessages,
  createRowOfProductsCarts,
  addProductToCart,
  btnLogoutListener,
  chargeWithoutProducts,
  createSummary,
  updateSummary,
  updateProducts,
  saveProducts,
  purchase,
  clearCookie,
  chargeProducts,
  createRowOfUsers,
  changeRoleToButton,
  deleteUserToButton,
};
