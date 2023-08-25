import jwt from "jsonwebtoken";
import environmentOptions from "../constants/server/environment.options.js";

const getHome = (req, res) => {
  res.render("home", {
    title: "Home",
  });
};

const getRealTimeProducts = (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Products",
  });
};

const getChat = (req, res) => {
  res.render("chat", {
    title: "Chat",
  });
};

const getProducts = (req, res) => {
  res.render("products", {
    title: "Products",
    user: req.user,
  });
};

const getRegister = (req, res) => {
  res.render("register", {
    title: "Register",
  });
};

const getLogin = (req, res) => {
  res.render("login", {
    title: "Log In",
  });
};

const getProfile = (req, res) => {
  res.render("profile", {
    title: "Profile",
    user: req.user,
  });
};

const getRetoreRequest = (req, res) => {
  res.render("restoreRequest", {
    title: "Restore Password",
  });
};

const getRestorePassword = (req, res) => {
  try {
    const { tkn } = req.query;

    const isValidToken = jwt.verify(tkn, environmentOptions.jwt.SECRET_KEY);
    res.render("restorePassword", {
      title: "Restore Password",
    });
  } catch (error) {
    res.render("invalidToken", {
      title: "Invalid Token",
    });
  }
};

const getCart = (req, res) => {
  res.render("cart", {
    title: "Cart",
    user: req.user,
  });
};

export {
  getHome,
  getRealTimeProducts,
  getChat,
  getProducts,
  getRegister,
  getLogin,
  getProfile,
  getRetoreRequest,
  getRestorePassword,
  getCart,
};
