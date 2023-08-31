export default class UserToken {
  static getFrom = (user) => {
    return {
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      age: user.age,
      email: user.email,
      role: user.role,
      cart: user.cart,
    };
  };
}
