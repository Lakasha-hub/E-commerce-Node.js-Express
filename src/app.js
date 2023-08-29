import Express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import initializePassportStrategies from "./config/passport.config.js";
import { attachLoggers } from "./middlewares/logger.midleware.js";
import environmentOptions from "./constants/server/environment.options.js";
import { __dirname } from "./utils.js";

import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import ViewsRouter from "./routes/views.router.js";
import UsersRouter from "./routes/users.router.js";

import productsHandler from "./listeners/products.handler.js";
import registerChatHandler from "./listeners/messages.handler.js";
import errorHandler from "./middlewares/errorHandler.js";

//Create instance of express
const app = Express();

//Initialize Server Express
const PORT = environmentOptions.app.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});

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

//Add logger service
app.use(attachLoggers);

//Middleware to add socket.io
app.use((req, res, next) => {
  req.io = io;
  req.logger.info("Socket connected");
  next();
});

//Socket config
io.on("connection", async (socket) => {
  registerChatHandler(io, socket);
  productsHandler(io, socket);
});

//Initialize Passport Strategies
initializePassportStrategies();

//Initialize Instances of Router
const sessionsRouter = new SessionsRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const usersRouter = new UsersRouter();
const viewsRouter = new ViewsRouter();

//Routes
app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());
app.use("/", viewsRouter.getRouter());

//Error Handler
app.use(errorHandler);
