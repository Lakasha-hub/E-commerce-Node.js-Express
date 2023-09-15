import BaseRouter from "./router.js";
import { getTicketsById } from "../controllers/tickets.controller.js"

export default class TicketsRouter extends BaseRouter {
  init() {
    this.get(
      "/:id",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      getTicketsById
    );
  }
}
