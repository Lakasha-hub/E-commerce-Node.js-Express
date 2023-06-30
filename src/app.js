import Express from "express";
import handlebars from "express-handlebars";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import initializePassportStrategies from "./config/passport.config.js";
import __dirname from "./utils.js";

import ProductsRouter from "./routes/products.router.js"
import CartsRouter from "./routes/carts.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import ViewsRouter from "./routes/views.router.js";

import productsHandler from "./listeners/products.handler.js";
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

//Set cookie parser
app.use(cookieParser());

//Middleware to add socket.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Initialize Passport Strategies
initializePassportStrategies();

//Initialize Instances of Router
const sessionsRouter = new SessionsRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const viewsRouter = new ViewsRouter();

console.log()

//Routes
app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/", viewsRouter.getRouter());

//Socket config
io.on("connection", async (socket) => {
  console.log("New Client Connected");
  registerChatHandler(io, socket);
  productsHandler(io, socket);
});
