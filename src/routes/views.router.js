import { Router } from "express";
import { privacy } from "../middlewares/auth.js";
const router = Router();

router.get("/home", privacy("PRIVATE"), (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

router.get("/realTimeProducts", privacy("PRIVATE"), (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Products",
  });
});

router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
  });
});

router.get("/products", privacy("PRIVATE"), (req, res) => {
  res.render("products", {
    title: "Products",
    user: req.session.user,
  });
});

router.get("/carts/:id", privacy("PRIVATE"), (req, res) => {
  const id = req.params.id;
  res.render("cart", {
    title: "Cart",
    id,
  });
});

router.get("/register", privacy("NO_AUTHENTICATED"), (req, res) => {
  res.render("register", {
    title: "Register",
  });
});

router.get("/login", privacy("NO_AUTHENTICATED"), (req, res) => {
  res.render("login", {
    title: "Log In",
  });
});

router.get("/restorePassword", privacy("NO_AUTHENTICATED"), (req, res) => {
  res.render("restorePassword", {
    title: "Restore Password",
  });
});

export default router;
