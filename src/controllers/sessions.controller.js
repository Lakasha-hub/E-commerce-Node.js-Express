import jwt from "jsonwebtoken";

import { usersService } from "../services/repositories/index.js";
import UserToken from "../dtos/user/user.token.js";
import {
  createHash,
  generateToken,
  validatePassword,
} from "../services/auth.service.js";

import UserMailing from "../dtos/user/user.mailing.js";
import MailingService from "../services/mailing.service.js";
import mailsTemplates from "../constants/mails/mails.templates.js";

import ErrorService from "../services/error.service.js";
import { ErrorManager } from "../constants/errors/index.js";
import environmentOptions from "../constants/server/environment.options.js";
import UserRestorePassword from "../dtos/user/user.restorePass.js";

const userRegister = async (req, res) => {
  try {
    const user = new UserMailing(req.user);
    const mailingService = new MailingService();
    await mailingService.sendMail(user.email, mailsTemplates.WELCOME, { user });
    return res.sendCreated("User successfully created");
  } catch (error) {
    res.sendInternalError(error);
  }
};

const userLogin = async (req, res) => {
  //Send token with user information
  const { ...user } = new UserToken(req.user);
  const accessToken = generateToken(user);
  res
    .cookie(environmentOptions.jwt.TOKEN_NAME, accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    })
    .sendSuccess("Login OK");
};

const userLoginGithub = async (req, res) => {
  //Send token with Github User information
  const { ...user } = new UserToken(req.user);
  const accessToken = generateToken(user);
  res
    .cookie(environmentOptions.jwt.TOKEN_NAME, accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    })
    .redirect("/products");
};

const currentUser = async (req, res) => {
  //Send token with user information
  res.sendSuccessWithPayload(req.user);
};

const userRestoreRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email.trim()) {
      ErrorService.create({
        name: "Error when validating fields",
        cause: ErrorManager.users.incompleteValue("email", email),
        code: ErrorManager.codes.INCOMPLETE_VALUES,
        message: "Invalid email",
        status: 400,
      });
    }

    const user = await usersService.getBy({ email });
    if (!user) {
      ErrorService.create({
        name: "Error verifying that the user exists",
        cause: ErrorManager.users.notFound("email", email),
        code: ErrorManager.codes.NOT_FOUND,
        message: "There is no registered user with this email",
        status: 400,
      });
    }

    const userToken = new UserRestorePassword(user);
    const restoreToken = generateToken({ userToken });
    const mailingService = new MailingService();
    await mailingService.sendMail(email, mailsTemplates.RESTORE, {
      restoreToken,
    });

    return res.sendSuccess(`Mail sent to: ${email}`);
  } catch (error) {
    res.sendError(error);
  }
};

const userRestorePassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const tokenUser = jwt.verify(
      token,
      environmentOptions.jwt.SECRET_KEY
    ).userToken;

    if (newPassword !== confirmPassword) {
      ErrorService.create({
        name: "Error when validating fields",
        cause: ErrorManager.users.notMatch(newPassword, confirmPassword),
        code: ErrorManager.codes.INVALID_VALUES,
        message: "Passwords do not match",
        status: 400,
      });
    }

    const user = await usersService.getBy({ _id: tokenUser.id });
    if (!user) {
      ErrorService.create({
        name: "Error verifying that the user exists",
        cause: ErrorManager.users.notFound("_id", tokenUser.id),
        code: ErrorManager.codes.NOT_FOUND,
        message: "There is no registered user with this email",
        status: 404,
      });
    }

    const isSamePassword = await validatePassword(newPassword, user.password);
    if (isSamePassword) {
      ErrorService.create({
        name: "Error when trying to change password",
        cause: ErrorManager.users.samePassword(),
        code: ErrorManager.codes.INVALID_VALUES,
        message:
          "This password was previously used for this account, please select another one",
        status: 400,
      });
    }

    const newHashedPassword = await createHash(newPassword);
    await usersService.updateById(user._id, {
      password: newHashedPassword,
    });

    return res.sendSuccess("Password succesfully updated");
  } catch (error) {
    return res.sendError(error);
  }
};

const userLogout = async (req, res) => {
  res
    .clearCookie(environmentOptions.jwt.TOKEN_NAME)
    .sendSuccess("Log out successfully");
};

export {
  userLogin,
  userRegister,
  userLoginGithub,
  userRestoreRequest,
  userRestorePassword,
  userLogout,
  currentUser,
};
