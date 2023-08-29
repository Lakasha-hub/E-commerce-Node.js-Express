import BaseRouter from "./router.js";
import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";
import { changeRole } from "../controllers/users.controller.js";

export default class UsersRouter extends BaseRouter {
  init() {
    this.put(
      "/premium/:id",
      ["USER_ROLE", "PREMIUM_ROLE"],
      verifyMongoID,
      changeRole
    );
  }
}
