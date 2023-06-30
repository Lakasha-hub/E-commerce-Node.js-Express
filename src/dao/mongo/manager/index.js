import UsersManager from "./users.manager.js";
import CartsManager from "./carts.manager.js";
import ProductsManager from "./products.manager.js";
import MessagesManager from "./messages.manager.js";

export const usersService = new UsersManager();
export const cartsService = new CartsManager();
export const productsService = new ProductsManager();
export const messagesService = new MessagesManager();
