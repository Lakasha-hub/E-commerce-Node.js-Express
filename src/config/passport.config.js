import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { Strategy, ExtractJwt } from "passport-jwt";

import { usersService } from "../dao/mongo/manager/index.js";
import { cookieExtractor } from "../utils.js";
import { createHash, validatePassword } from "../services/auth.service.js";

//Create instance of Local Strategy
const LocalStrategy = local.Strategy;

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const user_exists = await usersService.getUserBy({ email });
          if (user_exists)
            return done(null, false, { message: "User is already registered" });

          if (isNaN(age))
            return done(null, false, { message: "Age must be a number" });

          const hashedPassword = await createHash(password);

          const result = await usersService.createUser({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
          });

          return done(null, result, { message: "User created succesfully" });
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
            return done(null, user, { message: "OK" });
          }

          let user = await usersService.getUserBy({ email: email });
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
            age: user.age,
            email: user.email,
            role: user.role,
          };
          return done(null, user, { message: "OK" });
        } catch (error) {
          done(error);
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
          let user = await usersService.getUserBy({ email: email });
          if (!user) {
            const newUser = {
              first_name: name,
              last_name: " ",
              email: email,
              age: 0,
              password: " ",
              role: "USER_ROLE",
            };
            user = await usersService.createUser(newUser);
            return done(null, user, { message: "User created succesfully" });
          }
          return done(null, user, { message: "User created succesfully" });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Strategy "jwt" returns the user according to its token
  passport.use(
    "jwt",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_KEY,
      },
      async (payload, done) => {
        if (!payload) return done(null, false, { message: "Unauthorized" });
        return done(null, payload, { message: "OK" });
      }
    )
  );
};

export default initializePassportStrategies;
