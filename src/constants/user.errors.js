const incompleteValues = (user) => {
  return `One or more parameters were not provided:
    Required properties:
    * first_name: must be a string and was received ${user.first_name}
    * last_name: must be a string and was received ${user.last_name}
    * age: must be a number and was received ${user.age}
    * email: must be a string and was received ${user.email}
    * password: must be a string and was received ${user.password}`;
};

const invalidTypes = (user) => {
  return `One or more parameters were provided with an erroneous data type:
    Required type properties:
    * first_name: must be a string and was received ${typeof user.first_name}
    * last_name: must be a string and was received ${typeof user.last_name}
    * age: must be a number and was received ${typeof user.age}
    * email: must be a string and was received ${typeof user.email}
    * password: must be a string and was received ${typeof user.password}`;
};

const notFound = (email) => {
  return `No user was found with the parameter provided:
    Parameter provided:
    * email: ${email}`;
};

const duplicated = (email) => {
  return `The user with the sent parameters is already registered:
  Parameters sent:
  * email: ${email}`;
};

const user_errors = {
  invalidTypes,
  incompleteValues,
  notFound,
  duplicated,
};

export default user_errors;
