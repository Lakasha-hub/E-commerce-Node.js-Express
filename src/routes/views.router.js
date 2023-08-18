import BaseRouter from "./router.js";

export default class ViewsRouter extends BaseRouter {
  init() {
    this.get(
      "/home",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      (req, res) => {
        res.render("home", {
          title: "Home",
        });
      }
    );

    this.get(
      "/realTimeProducts",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      (req, res) => {
        res.render("realTimeProducts", {
          title: "Real Time Products",
        });
      }
    );

    this.get("/chat", ["USER_ROLE", "PREMIUN_ROLE"], (req, res) => {
      res.render("chat", {
        title: "Chat",
      });
    });

    this.get(
      "/products",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      (req, res) => {
        res.render("products", {
          title: "Products",
          user: req.user,
        });
      }
    );

    this.get("/register", ["NO_AUTH"], (req, res) => {
      res.render("register", {
        title: "Register",
      });
    });

    this.get("/login", ["NO_AUTH"], (req, res) => {
      res.render("login", {
        title: "Log In",
      });
    });

    this.get(
      "/profile",
      ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
      (req, res) => {
        res.render("profile", {
          title: "Profile",
          user: req.user,
        });
      }
    );

    this.get("/restorePassword", ["NO_AUTH"], (req, res) => {
      res.render("restorePassword", {
        title: "Restore Password",
      });
    });

    this.get("/cart/:id", ["USER_ROLE", "ADMIN_ROLE"], (req, res) => {
      res.render("cart", {
        title: "Cart",
        user: req.user,
      });
    });
  }
}
