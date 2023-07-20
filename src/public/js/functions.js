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

    /**<p class="card-text">Stock:${element.stock}</p>
      <p class="card-text">Code:${element.code}</p>
      <p class="card-text">Category:${element.category}</p>
      <p class="card-text">Status:${element.status}</p>
      <p class="card-text">Thumbnails:${element.thumbnails}</p>
      <p class="card-text">Id:${element._id}</p> */

    card.appendChild(cardBody);
    column.appendChild(card);
    rowBody.appendChild(column);
  });

  //Add to Home Page
  document.body.appendChild(rowBody);
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

  //Add to Home Page
  document.body.appendChild(rowBody);
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

  document.body.appendChild(messagesBody);
};

const createRowOfProductsCarts = (products) => {
  //Father Element
  const rowBody = document.querySelector("#rowProducts");

  //For Each Product => create Card
  products.forEach((element) => {
    const column = document.createElement("div");
    column.classList.add("col-3");
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("h-100");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    //Add Card information
    cardBody.innerHTML = `<h5>${element.product.title}</h5>
      <p class="card-text">Price:${element.product.price}</p>
      <p class="card-text">Stock:${element.product.stock}</p>
      `;

    card.appendChild(cardBody);
    column.appendChild(card);
    rowBody.appendChild(column);
  });

  //Add to Home Page
  document.body.appendChild(rowBody);
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
    });
  });
};
export {
  createRowOfProducts,
  createViewOfProducts,
  createViewOfMessages,
  createRowOfProductsCarts,
  addProductToCart,
};
