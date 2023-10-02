import BaseRouter from "./router.js";

import {
  getCart,
  getChat,
  getHome,
  getLogin,
  getProducts,
  getProfile,
  getRealTimeProducts,
  getRegister,
  getRestorePassword,
  getRetoreRequest,
  getPurchases,
  getPanelControl,
} from "../controllers/views.controller.js";

export default class ViewsRouter extends BaseRouter {
  init() {
    this.get("/home", ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"], getHome);

    this.get(
      "/realTimeProducts",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      getRealTimeProducts
    );

    this.get("/chat", ["USER_ROLE", "PREMIUM_ROLE"], getChat);

    this.get(
      "/products",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      getProducts
    );

    this.get("/register", ["NO_AUTH"], getRegister);

    this.get("/login", ["NO_AUTH"], getLogin);

    this.get(
      "/profile",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      getProfile
    );

    this.get(
      "/purchases",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      getPurchases
    );

    this.get("/restoreRequest", ["PUBLIC"], getRetoreRequest);

    this.get("/restorePassword", ["NO_AUTH"], getRestorePassword);

    this.get("/panelControl", ["ADMIN_ROLE"], getPanelControl);

    this.get("/cart/:id", ["USER_ROLE", "ADMIN_ROLE"], getCart);
  }
}
