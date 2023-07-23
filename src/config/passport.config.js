import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { Strategy, ExtractJwt } from "passport-jwt";
import "dotenv/config";

import { cartsService, usersService } from "../services/repositories/index.js";
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

          const user_exists = await usersService.getBy({ email });
          if (user_exists)
            return done(null, false, { message: "User is already registered" });

          if (isNaN(age))
            return done(null, false, { message: "Age must be a number" });

          const cart = await cartsService.create();

          const hashedPassword = await createHash(password);

          const result = await usersService.create({
            first_name,
            last_name,
            email,
            age,
            cart,
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
          if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
          ) {
            const adminUser = {
              _id: 0,
              first_name: "Admin",
              last_name: "Mode",
              age: 0,
              email: "...",
              role: "ADMIN_ROLE",
            };
            return done(null, adminUser, { message: "OK" });
          }

          const user = await usersService.getBy({ email: email });
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
        clientID: process.env.CLIENT_ID_GITHUB,
        clientSecret: process.env.CLIENT_SECRET_GITHUB,
        callbackURL: `http://localhost:${process.env.PORT}/api/sessions/githubcallback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json;
          const user = await usersService.getBy({ email: email });
          if (!user) {
            const cart = await cartsService.create();
            const newUser = {
              first_name: name,
              last_name: "",
              email: email,
              age: 0,
              cart,
              password: "",
              role: "USER_ROLE",
            };
            const userResult = await usersService.create(newUser);
            return done(null, userResult, {
              message: "User created succesfully",
            });
          }
          return done(null, user, { message: "OK" });
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
