import { faker } from "@faker-js/faker";

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    desc: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.number.int({ min: 10, max: 100 }),
    category: faker.animal.type(),
    thumbnails: [faker.image.url()],
    status: faker.datatype.boolean(),
  };
};

export const generateProductTest = () => {
  return {
    title: faker.commerce.productName(),
    desc: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.number.int({ min: 1, max: 100 }),
    category: faker.animal.type(),
    thumbnails: [faker.image.url()],
  };
};
