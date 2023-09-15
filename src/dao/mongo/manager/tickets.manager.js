import ticketModel from "../models/ticket.model.js";

export default class TicketManager {
  getTicketBy = (filter) => {
    return ticketModel.findOne(filter);
  };

  getTicketsBy = (filter) => {
    return ticketModel.find(filter).lean();
  };

  getTicketById = (id) => {
    return ticketModel.findById(id).lean();
  };

  createTicket = (ticket) => {
    return ticketModel.create(ticket);
  };
}
