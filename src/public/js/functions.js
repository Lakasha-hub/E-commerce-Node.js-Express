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
      <p class="card-text">Description:${element.description}</p>
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
      <p class="card-text">Description:${element.description}</p>
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
      <p class="card-text">Price per unit:${element.product.price}</p>
      <p class="card-text">Units:<span id="quantity">${element.quantity}</span></p>
      <button class="btn btn-dark decrementBtn" id="${element.product._id}">-</button>
      <button class="btn btn-dark incrementBtn" id="${element.product._id}">+</button>
      <p class="card-subtitle mt-2 text-body-secondary"><span id="stock">${element.product.stock}</span> available</p>
      `;

    card.appendChild(cardBody);
    rowProducts.appendChild(card);
  });
};

const createSummary = (cartId, products) => {
  const rowCart = document.querySelector(".row");

  const col = document.createElement("div");
  col.classList.add("col-md-4");
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
        timer: 1500,
        background: "#2ccd3c",
        color: "#fff",
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
            .catch((error) => console.log(error));
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
export {
  createRowOfProducts,
  createViewOfProducts,
  createViewOfMessages,
  createRowOfProductsCarts,
  addProductToCart,
  btnLogoutListener,
  chargeWithoutProducts,
  createSummary,
};
