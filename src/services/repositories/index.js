import PersistenceFactory from "../../dao/factory.js";

import UsersRepository from "./users.repository.js";
import ProductsRepository from "./products.repository.js";
import CartsRepository from "./carts.repository.js";
import MessagesRepository from "./messages.repository.js";

const manager = await PersistenceFactory.getPersistence();

export const usersService = new UsersRepository(manager.usersDAO);
export const productsService = new ProductsRepository(manager.productsDAO);
export const cartsService = new CartsRepository(manager.cartsDAO);
export const messagesService = new MessagesRepository(manager.messagesDAO);
