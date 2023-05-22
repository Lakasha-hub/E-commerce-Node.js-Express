import Express from "express";
import handlebars from "express-handlebars";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";

import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import ProductsManager from "./dao/mongo/manager/products.manager.js";
import registerChatHandler from "./listeners/messages.handler.js";
//Create instance of express
const app = Express();
//Config dotenv to read enviroment variables(PORT)
dotenv.config();
const PORT = process.env.PORT;

//Server Express
const server = app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});

const connection = mongoose.connect(process.env.DB_CONNECTION);

//Connect Server to io (Server Socket)
const io = new Server(server);

//Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Middlewares Express
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(`${__dirname}/public`));

//Middleware to add socket.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  console.log("New Client Connected");
  registerChatHandler(io, socket);
  //Create instance of Products Manager
  const productManager = new ProductsManager();
  //Call method getProducts() and send to view with socket
  const productsToView = await productManager.getProducts();

  io.emit("GetProductsUpdated", productsToView);
});
