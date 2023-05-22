import { Router } from "express";

const router = Router();

router.get("/home", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

router.get("/realTimeProducts", async(req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Products",
  });
});

router.get("/chat", async(req, res) => {
  res.render("chat", {
    title: "Chat",
  });
});

export default router;
