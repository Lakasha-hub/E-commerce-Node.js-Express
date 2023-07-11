export default class MessagesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getMessages = () => {
    return this.dao.getMessages();
  };

  createMessage = (msg) => {
    return this.dao.createMessage(msg);
  };
}
