import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";

import UsersManager from "../dao/mongo/manager/users.manager.js";
import { createHash, validatePassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const userManager = new UsersManager();

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;

          const user_exists = await userManager.getUserBy({ email });
          if (user_exists)
            return done(null, false, { message: "User is already registered" });

          const hashedPassword = await createHash(password);

          const result = await userManager.createUser({
            first_name,
            last_name,
            email,
            password: hashedPassword,
          });

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
            const user = {
              id: 0,
              name: "Admin",
              email: "...",
              role: "ADMIN_ROLE",
            };
            return done(null, user);
          }

          let user = await userManager.getUserBy({ email: email });
          if (!user)
            return done(null, false, {
              message: "The email or password is not correct",
            });

          const isValidPassword = await validatePassword(
            password,
            user.password
          );
          if (!isValidPassword)
            return done(null, false, {
              message: "The email or password is not correct",
            });

          user = {
            id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
          };

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.9c2094d7067aef1e",
        clientSecret: "59f5c5dc3905d8e7359c24f6dd8f09790f451fe6",
        callbackURL: `http://localhost:8080/api/sessions/githubcallback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json;
          let user = await userManager.getUserBy({ email: email });
          if (!user) {
            const newUser = {
              first_name: name,
              last_name: "  ",
              email: email,
              password: " ",
              role: "USER_ROLE",
            };
            user = await userManager.createUser(newUser);
            return done(null, user);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    if (user.id === 0) {
      return done(null, {
        id: 0,
        name: "Admin",
        email: "...",
        role: "ADMIN_ROLE",
      });
    }
    const result = await userManager.getUserBy({ _id: id });
    return done(null, result);
  });
};

export default initializePassportStrategies;
