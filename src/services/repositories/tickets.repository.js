export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getBy = (filter) => {
    return this.dao.getTicketBy(filter);
  };

  getById = (id) => {
    return this.dao.getTicketById(id);
  };

  create = (ticket) => {
    return this.dao.createTicket(ticket);
  };
}
