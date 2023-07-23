export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getBy = (filter) => {
    return this.dao.getUserBy(filter);
  };

  create = (user) => {
    return this.dao.createUser(user);
  };

  updateById = (id, params) => {
    return this.dao.updateUserById(id, params);
  };
}
