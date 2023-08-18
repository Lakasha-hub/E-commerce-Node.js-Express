import BaseRouter from "./router.js";

import { passportCall } from "../services/auth.service.js";
import {
  currentUser,
  userLogin,
  userLoginGithub,
  userLogout,
  userRegister,
  userRestorePassword,
} from "../controllers/sessions.controller.js";

// import { attempsLimitReached } from "../middlewares/attempsLimit.middleware.js";

export default class SessionsRouter extends BaseRouter {
  init() {
    this.post(
      "/register",
      ["NO_AUTH"],
      passportCall("register", { strategyType: "locals" }),
      userRegister
    );

    this.post(
      "/login",
      ["NO_AUTH"],
      passportCall("login", { strategyType: "locals" }),
      userLogin
    );

    this.post("/restorePassword", ["NO_AUTH"], userRestorePassword);

    this.get(
      "/logout",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      passportCall("jwt", { strategyType: "jwt" }),
      userLogout
    );

    this.get(
      "/github",
      ["NO_AUTH"],
      passportCall("github", { strategyType: "github" })
    );

    this.get(
      "/githubcallback",
      ["NO_AUTH"],
      passportCall("github", { strategyType: "github" }),
      userLoginGithub
    );

    this.get(
      "/current",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      passportCall("jwt", { strategyType: "jwt" }),
      currentUser
    );
  }
}
