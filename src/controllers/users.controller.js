import environmentOptions from "../constants/server/environment.options.js";
import { usersService } from "../services/repositories/index.js";
import { generateToken } from "../services/auth.service.js";
import UserToken from "../dtos/user/user.token.js";

const changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.user.role;

    if (role === "USER_ROLE") {
      const user = await usersService.updateById(id, {
        role: "PREMIUM_ROLE",
      });

      const userTokenDTO = new UserToken(user);
      const token = generateToken({ user: userTokenDTO });

      return res
        .clearCookie(environmentOptions.jwt.TOKEN_NAME)
        .cookie(environmentOptions.jwt.TOKEN_NAME, token, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          sameSite: "lax",
        })
        .sendSuccess("Role changed to PREMIUM");
    } else if (role === "PREMIUM_ROLE") {
      const user = await usersService.updateById(id, { role: "USER_ROLE" });

      const userTokenDTO = new UserToken(user);
      const token = generateToken({ user: userTokenDTO });

      return res
        .clearCookie(environmentOptions.jwt.TOKEN_NAME)
        .cookie(environmentOptions.jwt.TOKEN_NAME, token, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          sameSite: "lax",
        })
        .sendSuccess("Role changed to USER");
    }
  } catch (error) {
    console.log(error);
    res.sendError(error);
  }
};

export { changeRole };
