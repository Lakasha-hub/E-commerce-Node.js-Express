import BaseRouter from "./router.js";

export default class ViewsRouter extends BaseRouter {
  init() {
    
    this.get("/home", (req, res) => {
      res.render("home", {
        title: "Home",
      });
    });

    this.get("/realTimeProducts", (req, res) => {
      res.render("realTimeProducts", {
        title: "Real Time Products",
      });
    });

    this.get("/chat", (req, res) => {
      res.render("chat", {
        title: "Chat",
      });
    });

    this.get("/products", (req, res) => {
      res.render("products", {
        title: "Products",
        user: req.user,
      });
    });

    this.get("/carts/:id", (req, res) => {
      const id = req.params.id;
      res.render("cart", {
        title: "Cart",
        id,
      });
    });

    this.get("/register", (req, res) => {
      res.render("register", {
        title: "Register",
      });
    });

    this.get("/login", (req, res) => {
      res.render("login", {
        title: "Log In",
      });
    });

    this.get("/restorePassword", (req, res) => {
      res.render("restorePassword", {
        title: "Restore Password",
      });
    });
  }
}
