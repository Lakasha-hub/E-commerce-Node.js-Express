import { messagesService } from "../services/repositories/index.js";

const registerChatHandler = (io, socket) => {
  const getMessages = async () => {
    const result = await messagesService.getAll();
    io.emit("UpdateMessages", result);
  };

  const saveMessage = async (message) => {
    await messagesService.create(message);
    const result = await messagesService.getAll();
    io.emit("UpdateMessages", result);
  };

  const newParticipant = (user) => {
    socket.broadcast.emit("newConnection", user);
  };
  socket.on("newParticipant", newParticipant);
  socket.on("createMessage", saveMessage);
  socket.on("getMessages", getMessages);
};

export default registerChatHandler;
