import mongoose from "mongoose";

const persistence = "MONGO";

export default class PersistenceFactory {
  static async getPersistence() {
    let usersDAO;
    let productsDAO;
    let cartsDAO;
    let messagesDAO;

    switch (persistence) {
      case "MONGO":
        mongoose.connect(process.env.DB_CONNECTION);
        const { default: usersManagerDAO } = await import(
          "./mongo/manager/users.manager.js"
        );
        const { default: productsManagerDAO } = await import(
          "./mongo/manager/products.manager.js"
        );
        const { default: cartsManagerDAO } = await import(
          "./mongo/manager/carts.manager.js"
        );
        const { default: messagesManagerDAO } = await import(
          "./mongo/manager/messages.manager.js"
        );
        usersDAO = new usersManagerDAO();
        productsDAO = new productsManagerDAO();
        cartsDAO = new cartsManagerDAO();
        messagesDAO = new messagesManagerDAO();
        break;
    }

    return {
      usersDAO,
      productsDAO,
      cartsDAO,
      messagesDAO,
    };
  }
}
