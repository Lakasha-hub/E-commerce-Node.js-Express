import { __dirname } from "../utils.js";

const swaggerConfig = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce",
      description: "Ecommerce documentation",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

export default swaggerConfig;
