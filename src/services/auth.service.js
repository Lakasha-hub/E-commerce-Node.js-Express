import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import environmentOptions from "../constants/server/environment.options.js";

export const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

export const validatePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const passportCall = (strategy, options = {}) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) return next(error);
      if (!options.strategyType) {
        req.logger.error(`Route ${req.url} doesnt have defined a strategy`);
        return res.sendInternalError(
          `Route ${req.url} doesnt have defined a strategy`
        );
      }
      if (!user) {
        switch (options.strategyType) {
          case "jwt":
            req.error = info.message ? info.message : info.toString();
            return next();
          case "locals":
            return res.sendUnauthorized(
              info.message ? info.message : info.toString()
            );
          case "github":
            return res.sendUnauthorized(
              info.message ? info.message : info.toString()
            );
        }
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

const jwtKey = environmentOptions.jwt.SECRET_KEY;
export const generateToken = (user, expiresIn = "1d") => {
  const token = jwt.sign(user, jwtKey, { expiresIn });
  return token;
};
