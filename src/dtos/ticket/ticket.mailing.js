export default class TicketMailing {
    static getFrom = (ticket) => {
      return {
        code: ticket.code,
        email: ticket.purchaser,
        amount: ticket.amount,
        date: ticket.purchase_datetime,
      };
    };
  }