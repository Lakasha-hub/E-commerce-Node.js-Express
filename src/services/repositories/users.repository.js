export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = () => {
    return this.dao.getUsers();
  };

  getBy = (filter) => {
    return this.dao.getUserBy(filter);
  };

  create = (user) => {
    return this.dao.createUser(user);
  };

  updateById = (id, params) => {
    return this.dao.updateUserById(id, params);
  };

  deleteById = (id) => {
    return this.dao.deleteUserById(id);
  };

  bulkDelete = (users) => {
    const bulk = [];
    users.forEach((user) => {
      const deleteDoc = {
        deleteOne: {
          filter: { _id: user._id },
        },
      };
      bulk.push(deleteDoc);
    });
    return this.dao.bulkDelete(bulk);
  };
}
