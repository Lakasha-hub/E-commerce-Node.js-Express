import userModel from "../models/user.model.js";

export default class UsersManager {
  getUserBy = (query) => {
    return userModel.findOne(query).lean();
  };

  createUser = (user) => {
    return userModel.create(user);
  };

  updateUserById = (id, params) => {
    return userModel.findByIdAndUpdate(id, params);
  };
}
