import { usersService } from "../services/repositories/index.js";
import { createHash, generateToken } from "../services/auth.service.js";
import UserToken from "../dtos/user/user.token.js";
import UserMailing from "../dtos/user/user.mailing.js";

import ErrorService from "../services/error.service.js";
import { ErrorManager } from "../constants/errors/index.js";
import environmentOptions from "../constants/server/environment.options.js";
import MailingService from "../services/mailing.service.js";
import mailsTemplates from "../constants/mails/mails.templates.js";

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

const userRestorePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await usersService.getBy({ email });
    if (!user) {
      ErrorService.create({
        name: "Error verifying that the user exists",
        cause: ErrorManager.users.notFound(email),
        code: ErrorManager.codes.NOT_FOUND,
        message: "There is no registered user with this email",
        status: 404,
      });
    }

    const newHashedPassword = await createHash(password);
    user = await usersService.updateById(user._id, {
      password: newHashedPassword,
    });

    return res.sendSuccessWithPayload(user);
  } catch (error) {
    return res.sendError(error);
  }
};

const userLogout = async (req, res) => {
  res.clearCookie(environmentOptions.jwt.TOKEN_NAME).sendSuccess("Log Out OK");
};

export {
  userLogin,
  userRegister,
  userLoginGithub,
  userRestorePassword,
  userLogout,
  currentUser,
};
