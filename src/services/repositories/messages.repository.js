export default class MessagesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = () => {
    return this.dao.getMessages();
  };

  create = (msg) => {
    return this.dao.createMessage(msg);
  };
}
