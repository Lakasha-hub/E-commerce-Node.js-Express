import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import { Strategy, ExtractJwt } from "passport-jwt";

import { cartsService, usersService } from "../services/repositories/index.js";
import { cookieExtractor } from "../utils.js";
import { createHash, validatePassword } from "../services/auth.service.js";

import ErrorService from "../services/error.service.js";
import { ErrorManager } from "../constants/errors/index.js";
import environmentOptions from "../constants/server/environment.options.js";

//Create instance of Local Strategy
const LocalStrategy = local.Strategy;

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;

          if (!first_name || !last_name || !age || !email || !password) {
            ErrorService.create({
              name: "Error registering a new user",
              cause: ErrorManager.users.incompleteValues({
                first_name,
                last_name,
                age,
                email,
                password,
              }),
              code: ErrorManager.codes.INCOMPLETE_VALUES,
              message: "There are incomplete fields",
              status: 400,
            });
          }

          if (isNaN(age)) {
            ErrorService.create({
              name: "Error registering a new user",
              cause: ErrorManager.users.invalidTypes({
                first_name,
                last_name,
                age,
                email,
                password,
              }),
              code: ErrorManager.codes.INVALID_TYPES,
              message: "There are fields with wrong data types",
              status: 400,
            });
          }

          const user_exists = await usersService.getBy({ email });
          if (user_exists) {
            ErrorService.create({
              name: "Error registering a new user",
              cause: ErrorManager.users.duplicated(email),
              code: ErrorManager.codes.DUPLICATED,
              message: "User is already registered",
              status: 409,
            });
          }

          const cart = await cartsService.create();

          const hashedPassword = await createHash(password);

          const result = await usersService.create({
            first_name,
            last_name,
            email,
            age,
            cart,
            password: hashedPassword,
            role,
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
            email === environmentOptions.app.ADMIN_EMAIL &&
            password === environmentOptions.app.ADMIN_PASSWORD
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
          if (!user) {
            ErrorService.create({
              name: "Error when initializing user session",
              cause: ErrorManager.users.notFound("email", email),
              code: ErrorManager.codes.NOT_FOUND,
              message: "The email or password is not correct",
              status: 401,
            });
          }

          const isValidPassword = await validatePassword(
            password,
            user.password
          );
          if (!isValidPassword) {
            ErrorService.create({
              name: "Error when initializing user session",
              cause: ErrorManager.users.notFound("email", email),
              code: ErrorManager.codes.NOT_FOUND,
              message: "The email or password is not correct",
              status: 401,
            });
          }

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
        clientID: environmentOptions.github.CLIENT_ID,
        clientSecret: environmentOptions.github.CLIENT_SECRET,
        callbackURL: `http://localhost:${environmentOptions.app.PORT}/api/sessions/githubcallback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json;
          const user = await usersService.getBy({ email: email });
          if (!user) {
            const cart = await cartsService.create();
            const newUser = {
              first_name: name,
              last_name: " ",
              email: email,
              age: 0,
              cart,
              password: " ",
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
        secretOrKey: environmentOptions.jwt.SECRET_KEY,
      },
      async (payload, done) => {
        if (!payload) return done(null, false, { message: "Unauthorized" });
        return done(null, payload, { message: "OK" });
      }
    )
  );
};

export default initializePassportStrategies;
