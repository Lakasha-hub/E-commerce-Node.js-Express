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
  });
});

router.get("/carts/:id", async (req, res) => {
  res.render("cart", {
    title: "Cart",
  });
});

export default router;
