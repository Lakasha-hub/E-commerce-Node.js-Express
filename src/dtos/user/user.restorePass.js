export default class UserRestorePassword {
  static getFrom = (user) => {
    return {
      id: user._id,
    };
  };
}
