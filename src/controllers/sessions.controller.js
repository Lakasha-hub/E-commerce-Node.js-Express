import UsersManager from "../dao/mongo/manager/users.manager.js";
import { createHash, validatePassword } from "../utils.js";

const userManager = new UsersManager();

const userGetBy = async (req, res) => {
  if (req.session.messages) {
    return res.redirect("/api/sessions/loginFail");
  }
  req.session.user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
  return res.status(200).json({ payload: req.session.user });
};

const userPost = async (req, res) => {
  return res.status(201).json({ msg: "User successfully created" });
};

const userRestorePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userManager.getUserBy({ email: email });
    if (!user) throw new Error("There is no registered user with this email");

    const newHashedPassword = await createHash(password);
    user = await userManager.updateUserByID(user._id, {
      password: newHashedPassword,
    });

    return res.status(200).json({ payload: user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    if (!req.session) {
      throw new Error("There is no session active");
    }
    req.session.destroy();
    return res.status(200).json({ msg: "Session Eliminated" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const userFormFail = async (req, res) => {
  const error = req.session.messages[req.session.messages.length - 1];
  return res.status(400).json({ error });
};

const userLoginGithub = async (req, res) => {
  // if (req.session.messages) {
  //   return res.redirect("/api/sessions/loginFail");
  // }
  req.session.user = {
    id: req.user.id,
    name: req.user.first_name,
    email: req.user.email,
    role: req.user.role,
  };
  return res.status(200).json({ payload: req.session.user });
};

export { userGetBy, userPost, userLoginGithub, userRestorePassword, userLogout, userFormFail };
