export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUserBy = (filter) => {
    return this.dao.getUserBy(filter);
  };

  createUser = (user) => {
    return this.dao.createUser(user);
  };

  updateUserById = (id, params) => {
    return this.dao.updateUserById(id, params);
  };
}
