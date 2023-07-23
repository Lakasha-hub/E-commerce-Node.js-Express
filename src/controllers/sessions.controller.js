import { usersService } from "../services/repositories/index.js";
import { createHash, generateToken } from "../services/auth.service.js";
import UserToken from "../dtos/user/user.token.js";
import { cookieExtractor } from "../utils.js";

const userRegister = async (req, res) => {
  return res.sendCreated("User successfully created");
};

const userLogin = async (req, res) => {
  //Send token with user information
  const { ...user } = new UserToken(req.user);
  const accessToken = generateToken(user);
  res
    .cookie("authToken", accessToken, {
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
    .cookie("authToken", accessToken, {
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

    let user = await usersService.getBy({ email: email });
    if (!user) throw new Error("There is no registered user with this email");

    const newHashedPassword = await createHash(password);
    user = await usersService.updateById(user._id, {
      password: newHashedPassword,
    });

    return res.sendSuccessWithPayload(user);
  } catch (error) {
    return res.sendBadRequest(error);
  }
};

const userLogout = async (req, res) => {
  res.clearCookie("authToken").sendSuccess("Log Out OK");
};

export {
  userLogin,
  userRegister,
  userLoginGithub,
  userRestorePassword,
  userLogout,
  currentUser,
};
