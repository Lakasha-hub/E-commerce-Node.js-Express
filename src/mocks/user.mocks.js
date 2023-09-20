import { faker } from "@faker-js/faker";

export const generateUser = () => {
  return {
    id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 1, max: 100 }),
    email: faker.internet.email(),
    password: faker.string.alpha(10),
    status: faker.datatype.boolean(),
    cart: faker.database.mongodbObjectId(),
  };
};

export const generateUserRegister = () => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 1, max: 100 }),
    email: faker.internet.email(),
    password: faker.string.alpha(10),
  };
};
