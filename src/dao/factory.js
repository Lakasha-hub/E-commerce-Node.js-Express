import mongoose from "mongoose";
import { serverOptions } from "../config/server.config.js";
import environmentOptions from "../constants/server/environment.options.js";

const persistence = serverOptions.dao;
console.log(`Persistence in use: ${persistence}`);

export default class PersistenceFactory {
  static async getPersistence() {
    let usersDAO;
    let productsDAO;
    let cartsDAO;
    let messagesDAO;
    let ticketsDAO;

    switch (persistence) {
      case "MONGO":
        
        let urlConnection;
        serverOptions.env === "prod"
          ? (urlConnection = environmentOptions.mongo.URL_CONNECTION)
          : (urlConnection = environmentOptions.mongo.URL_CONNECTION_TEST);

        mongoose.connect(urlConnection);
        const { default: UsersManager } = await import(
          "./mongo/manager/users.manager.js"
        );
        const { default: ProductsManager } = await import(
          "./mongo/manager/products.manager.js"
        );
        const { default: CartsManager } = await import(
          "./mongo/manager/carts.manager.js"
        );
        const { default: MessagesManager } = await import(
          "./mongo/manager/messages.manager.js"
        );
        const { default: TicketManager } = await import(
          "./mongo/manager/tickets.manager.js"
        );

        usersDAO = new UsersManager();
        productsDAO = new ProductsManager();
        cartsDAO = new CartsManager();
        messagesDAO = new MessagesManager();
        ticketsDAO = new TicketManager();
        break;
    }

    return {
      usersDAO,
      productsDAO,
      cartsDAO,
      messagesDAO,
      ticketsDAO,
    };
  }
}
