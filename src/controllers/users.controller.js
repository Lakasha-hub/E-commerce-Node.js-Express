import { usersService } from "../services/repositories/index.js";

import MailingService from "../services/mailing.service.js";
import mailsTemplates from "../constants/mails/mails.templates.js";

import UserGet from "../dtos/user/user.get.js";

import ErrorService from "../services/error.service.js";
import { ErrorManager } from "../constants/errors/index.js";
import environmentOptions from "../constants/server/environment.options.js";

const getUsers = async (req, res) => {
  try {
    const usersDB = await usersService.getAll();
    const filteredUsers = usersDB.map((user) => {
      return UserGet.getFrom(user);
    });
    res.sendSuccessWithPayload(filteredUsers);
  } catch (error) {
    res.sendError(error);
  }
};

const deleteUsers = async (req, res) => {
  try {
    const users = req.body;
    //Get emails of deleted users
    const emails = users.map((user) => {
      return user.email;
    });
    //Delete all Users
    await usersService.bulkDelete(users);

    //Send an email to advice users
    const url = environmentOptions.app.BASE_URL;
    const mailingService = new MailingService();
    await mailingService.sendMail(emails, mailsTemplates.EXPIRED_ACCOUNT, {
      url,
    });

    res.sendSuccess("Users deleted");
  } catch (error) {
    res.sendError(error);
  }
};

const deleteOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await usersService.getBy({ _id: id });
    if (!user) {
      ErrorService.create({
        name: "Error when deleting a user",
        cause: ErrorManager.users.notFound("_id", id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered user with id: ${id}`,
        status: 404,
      });
    }

    //Delete user
    await usersService.deleteById(id);

    //Send an email to advice user
    const url = environmentOptions.app.BASE_URL;
    const mailingService = new MailingService();
    await mailingService.sendMail(user.email, mailsTemplates.DELETED_ACCOUNT, {
      url,
    });

    res.sendSuccess("User deleted");
  } catch (error) {
    res.sendError(error);
  }
};

const changeRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await usersService.getBy({ _id: id });
    if (!user) {
      ErrorService.create({
        name: "Error when updating a user",
        cause: ErrorManager.users.notFound("_id", id),
        code: ErrorManager.codes.NOT_FOUND,
        message: `There is no registered user with id: ${id}`,
        status: 404,
      });
    }

    if (user.role === "USER_ROLE") {
      await usersService.updateById(id, {
        role: "PREMIUM_ROLE",
      });
    } else if (user.role === "PREMIUM_ROLE") {
      await usersService.updateById(id, {
        role: "USER_ROLE",
      });
    }
    return res.sendSuccess("Role changed");
  } catch (error) {
    res.sendError(error);
  }
};

export { changeRole, getUsers, deleteUsers, deleteOneUser };
