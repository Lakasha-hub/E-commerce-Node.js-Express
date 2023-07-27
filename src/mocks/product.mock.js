import { faker } from "@faker-js/faker";

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    code: faker.string.alphanumeric(10),
    stock: faker.number.int({ min: 1, max: 100 }),
    category: faker.animal.type(), 
    thumbnails: [faker.image.url()],
    status: faker.datatype.boolean(),
  };
};
