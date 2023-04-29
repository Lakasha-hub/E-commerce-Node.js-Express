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
      <p class="card-text">Code:${element.code}</p>
      <p class="card-text">Stock:${element.stock}</p>
      <p class="card-text">Category:${element.category}</p>
      <p class="card-text">Status:${element.status}</p>
      <p class="card-text">Thumbnails:${element.thumbnails}</p>
      <p class="card-text">Id:${element.id}</p>
      `;

    card.appendChild(cardBody);
    column.appendChild(card);
    rowBody.appendChild(column);
  });

  //Add to Home Page
  document.body.appendChild(rowBody);
};

export { createRowOfProducts };
