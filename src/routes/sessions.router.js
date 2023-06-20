import { Router } from "express";
import passport from "passport";

import {
  userFormFail,
  userGetBy,
  userLoginGithub,
  userLogout,
  userPost,
  userRestorePassword,
} from "../controllers/sessions.controller.js";

import { attempsLimitReached } from "../middlewares/attempsLimit.middleware.js";

const router = Router();

router.get(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
    failureMessage: true,
  }),
  userGetBy
);

router.get("/loginFail", [attempsLimitReached], userFormFail);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerFail",
    failureMessage: true,
  }),
  userPost
);

router.get("/registerFail", userFormFail);

router.post("/restorePassword", userRestorePassword);

router.get("/logout", userLogout);

router.get("/github", passport.authenticate("github"));

router.get("/githubcallback", passport.authenticate("github"), userLoginGithub);

export default router;
