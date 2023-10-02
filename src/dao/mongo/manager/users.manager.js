import userModel from "../models/user.model.js";

export default class UsersManager {
  getUsers = () => {
    return userModel.find().lean();
  };

  getUserBy = (query) => {
    return userModel.findOne(query).lean();
  };

  createUser = (user) => {
    return userModel.create(user);
  };

  updateUserById = (id, params) => {
    return userModel.findByIdAndUpdate(id, params);
  };

  deleteUserById = (id) => {
    return userModel.findByIdAndDelete(id);
  };

  bulkDelete = (bulkOperation) => {
    return userModel.bulkWrite(bulkOperation);
  };
}
