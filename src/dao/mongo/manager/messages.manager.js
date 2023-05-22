import messageModel from "../models/message.model.js";

export default class MessagesManager {
  getMessages = () => {
    return messageModel.find().lean();
  };
  
  createMessage = (message) => {
    return messageModel.create(message);
  };
}
