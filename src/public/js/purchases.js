import { btnLogoutListener } from "./functions.js";

btnLogoutListener();

fetch("/api/tickets/purchases")
  .then((res) => res.json())
  .then((data) => {
    const rowTickets = document.querySelector("#rowTickets");
    rowTickets.innerHTML = "";

    //For Each Product => create Card
    data.payload.forEach((ticket) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("mb-2");
      card.classList.add("cardProduct");
      const cardBody = document.createElement("div");
      card.classList.add("card-body");

      //Add Card information
      cardBody.innerHTML = `<h5 class="card-title">${ticket.purchase_datetime}</h5>
      <p class="card-text">amount: ${ticket.amount}</p>
      <p class="card-text">Unique code of purchase: ${ticket.code}</p>
      `;

      card.appendChild(cardBody);
      rowTickets.appendChild(card);
    });
  })
  .catch((error) => console.log(error));
