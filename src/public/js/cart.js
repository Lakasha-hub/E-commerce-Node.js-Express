const url = new URL(window.location.href);
const id = url.pathname.split("/").pop();

let cart;
fetch(`/api/carts/${id}`)
  .then((res) => res.json())
  .then((data) => {
    cart = data.payload;
    displayCart(cart)
  })
  .catch((error) => console.log(error));

const displayCart = () => {
  const rowBody = document.querySelector(".row.row-cols-1.row-cols-md-4.g-4");

  const column = document.createElement("div");
  column.classList.add("col");
  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("h-100");
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  cardBody.innerHTML = `<h5>${cart._id}</h5>
      <p class="card-text">products:${JSON.stringify(cart.products)}</p>
      <p class="card-text">created_at:${cart.created_at}</p>
      <p class="card-text">updated_at:${cart.updated_at}</p>
      `;

  card.appendChild(cardBody);
  column.appendChild(card);
  rowBody.appendChild(column);
  //Add to Home Page
  document.body.appendChild(rowBody);
};
