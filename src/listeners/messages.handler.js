import MessagesManager from "../dao/mongo/manager/messages.manager.js";

const messageManager = new MessagesManager();

const registerChatHandler = (io, socket) => {
  const getMessages = async (req, res) => {
    const result = await messageManager.getMessages();
    req.io.emit("UpdateMessages", result);
  };

  const saveMessage = async (message) => {
    await messageManager.createMessage(message);
    const result = await messageManager.getMessages();
    io.emit("UpdateMessages", result);
  };

  const newParticipant = (user) => {
    socket.broadcast.emit("newConnection", user);
  };
  socket.on("newParticipant", newParticipant);
  socket.on("createMessage", saveMessage);
};

export default registerChatHandler;