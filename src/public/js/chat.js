import { createViewOfMessages } from "./functions.js";

const socket = io({
  autoConnect: false,
});

let newUser;

Swal.fire({
  title: "What is your name?",
  icon: "question",
  input: "text",
  showCancelButton: false,
  allowEscapeKey: false,
  allowOutsideClick: false,
  confirmButtonText: "Ok",
  inputValidator: (value) => {
    return !value && "You need to place a name";
  },
}).then((result) => {
  newUser = result.value;
  socket.connect();
  socket.emit("getMessages");
  socket.emit("newParticipant", newUser);
});

socket.on("UpdateMessages", (messages) => {
  const messagesBody = document.querySelector(".messages");
  messagesBody.innerHTML = "";
  createViewOfMessages(messages);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const newMessage = document.querySelector(".form-control");
    if (newMessage.value.trim().length < 0) {
      return Swal.fire({
        position: "top-end",
        title: "You need write something!!!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    socket.emit("createMessage", { message: newMessage.value, user: newUser });
    newMessage.value = "";
  }
});
document.querySelector(".btn").addEventListener("click", () => {
  const newMessage = document.querySelector(".form-control");
  if (newMessage.value.trim().length < 0) {
    return Swal.fire({
      position: "top-end",
      title: "You need write something!!!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  socket.emit("createMessage", { message: newMessage.value, user: newUser });
  newMessage.value = "";
});

socket.on("newConnection", (user) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    title: `${user} joined the chat`,
    icon: "success",
  });
});
