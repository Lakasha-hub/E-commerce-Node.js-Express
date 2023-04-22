import Express, { urlencoded } from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

//Create instance of express
const app = Express();

//Middlewares Express
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Server Listen
app.listen(8080, () => {
  console.log("Server running on: http://localhost:8080");
});
