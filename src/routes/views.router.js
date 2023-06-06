import { Router } from "express";

const router = Router();

router.get("/home", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

router.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Products",
  });
});

router.get("/chat", async (req, res) => {
  res.render("chat", {
    title: "Chat",
  });
});

router.get("/products", async (req, res) => {
  res.render("products", {
    title: "Products",
    user: req.session.user,
  });
});

router.get("/carts/:id", async (req, res) => {
  const id = req.params.id;
  res.render("cart", {
    title: "Cart",
    id,
  });
});

router.get("/register", async (req, res) => {
  res.render("register", {
    title: "Register",
  });
});

router.get("/login", async (req, res) => {
  res.render("login", {
    title: "Log In",
  });
});
export default router;
