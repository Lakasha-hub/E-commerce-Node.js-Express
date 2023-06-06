import { Router } from "express";
import {
  userGetBy,
  userLogout,
  userPost,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", userGetBy);

router.post("/", userPost);

router.get("/logout", userLogout);

export default router;
