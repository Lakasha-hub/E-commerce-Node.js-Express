import BaseRouter from "./router.js";
import { verifyMongoID } from "../middlewares/verifyMongoID.middleware.js";
import {
  changeRole,
  getUsers,
  deleteUsers,
  deleteOneUser,
} from "../controllers/users.controller.js";

export default class UsersRouter extends BaseRouter {
  init() {
    this.get("/", ["ADMIN_ROLE"], getUsers);

    this.delete("/", ["PUBLIC"], deleteUsers);

    this.put(
      "/premium/:id",
      ["USER_ROLE", "PREMIUM_ROLE", "ADMIN_ROLE"],
      verifyMongoID,
      changeRole
    );

    this.delete("/:id", ["ADMIN_ROLE"], verifyMongoID, deleteOneUser);
  }
}
