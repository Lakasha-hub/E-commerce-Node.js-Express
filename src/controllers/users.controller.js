import UsersManager from "../dao/mongo/manager/users.manager.js";
import session from "express-session";
const userManager = new UsersManager();

const userGetBy = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) throw new Error("query filter is required");
    let filters = {};
    const separatorQuery = query.split("/");
    separatorQuery.forEach((element) => {
      const filter = element.split("=");
      const key = filter[0].trim();
      let value = filter[1].trim();
      filters = { ...filters, [key]: value };
    });

    if (
      filters.email == "adminCoder@coder.com" &&
      filters.password == "adminCod3r123"
    ) {
      req.session.user = { name: "Admin" };
      return res.status(200).json({ msg: "OK" });
    }

    const result = await userManager.getUserBy(filters);
    if (!result) throw new Error(`The email or password is not correct`);

    req.session.user = {
      name: `${result.first_name} ${result.last_name}`,
      email: result.email,
    };

    return res.status(200).json({ payload: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const userPost = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const user_exists = await userManager.getUserBy({ email });
    if (user_exists) throw new Error(`email: ${email} is already registered`);

    const result = await userManager.createUser({
      first_name,
      last_name,
      email,
      password,
    });

    return res
      .status(201)
      .json({ msg: "User successfully created", payload: result });
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

export { userGetBy, userPost, userLogout };
