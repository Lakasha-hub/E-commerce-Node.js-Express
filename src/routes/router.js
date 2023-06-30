import { Router } from "express";
import { passportCall } from "../services/auth.service.js";

export default class BaseRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      passportCall("jwt", { strategyType: "jwt" }),
      this.customResponses,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      passportCall("jwt", { strategyType: "jwt" }),
      this.customResponses,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      passportCall("jwt", { strategyType: "jwt" }),
      this.customResponses,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      passportCall("jwt", { strategyType: "jwt" }),
      this.customResponses,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  /**Generate Standardized Responses */
  customResponses = (req, res, next) => {
    res.sendSuccess = (msg) => res.status(200).json({ status: "success", msg });

    res.sendSuccessWithPayload = (payload) =>
      res.status(200).json({ status: "success", payload });

    res.sendCreated = (msg) => res.status(201).json({ status: "success", msg });

    res.sendCreatedWithPayload = (payload) =>
      res.status(201).json({ status: "success", payload });

    res.sendBadRequest = (error) =>
      res.status(400).json({ status: "error", error });

    res.sendUnauthorized = (error) =>
      res.status(401).json({ status: "error", error });

    res.sendForbidden = (error) =>
      res.status(403).json({ status: "error", error });

    res.sendNotFound = (error) =>
      res.status(404).json({ status: "error", error });

    res.sendInternalError = (error) =>
      res.status(500).json({ status: "error", error });
    next();
  };

  handlePolicies = (policies) => {
    return (req, res, next) => {
      if (policies[0] === "PUBLIC") return next();

      const user = req.user;
      if (policies[0] === "NO_AUTH" && user)
        return res.sendUnauthorized("Unauthorized");

      if (policies[0] === "NO_AUTH" && !user) return next();

      if (!user) {
        console.log(req.error);
        return res.sendUnauthorized(req.error);
      } //req.error => error from jwt strategy

      if (policies.includes(user.role.toUpperCase()))
        return res.sendForbidden("Access Denied");

      next();
    };
  };

  /** Apply all middlewares from routes */
  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        req, res, next;
        params[1].sendInternalError(error);
      }
    });
  }
}
