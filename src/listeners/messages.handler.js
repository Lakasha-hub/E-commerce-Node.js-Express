import { messagesService } from "../dao/mongo/manager/index.js";

const registerChatHandler = (io, socket) => {
  const getMessages = async () => {
    const result = await messagesService.getMessages();
    io.emit("UpdateMessages", result);
  };

  const saveMessage = async (message) => {
    await messagesService.createMessage(message);
    const result = await messagesService.getMessages();
    io.emit("UpdateMessages", result);
  };

  const newParticipant = (user) => {
    socket.broadcast.emit("newConnection", user);
  };
  socket.on("newParticipant", newParticipant);
  socket.on("createMessage", saveMessage);
  socket.on("getMessages", getMessages)
};

export default registerChatHandler;
