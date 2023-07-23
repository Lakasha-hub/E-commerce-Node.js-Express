import ticketModel from "../models/ticket.model.js";

export default class TicketManager {
  getTicketBy = (filter) => {
    return ticketModel.findOne(filter);
  };

  getTicketById = (id) => {
    return ticketModel.findById(id).lean();
  };

  createTicket = (ticket) => {
    return ticketModel.create(ticket);
  };
}
