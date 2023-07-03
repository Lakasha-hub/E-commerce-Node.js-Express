import { usersService } from "../dao/mongo/manager/index.js";
import { createHash, generateToken } from "../services/auth.service.js";

const userRegister = async (req, res) => {
  return res.sendCreated("User successfully created");
};

const userLogin = async (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
  };
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
  const user = {
    id: req.user.id,
    name: req.user.first_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
  };

  const accessToken = generateToken(user);
  res
    .cookie("authToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    })
    .sendSuccess("Login OK");
};

const currentUser = async (req, res) => {
  res.sendSuccessWithPayload(req.user);
};

const userRestorePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await usersService.getUserBy({ email: email });
    if (!user) throw new Error("There is no registered user with this email");

    const newHashedPassword = await createHash(password);
    user = await usersService.updateUserByID(user._id, {
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
