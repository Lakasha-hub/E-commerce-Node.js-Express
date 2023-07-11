export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUserBy = (filter) => {
    return this.dao(filter);
  };

  createUser = (user) => {
    return this.dao.createUser(user);
  };

  updateUser = (id, params) => {
    return this.dao.updateUserById(id, params);
  };
}
