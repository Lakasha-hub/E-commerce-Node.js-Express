export default {
  app: {
    PORT: process.env.PORT || 8080,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  mongo: {
    URL_CONNECTION: process.env.DB_CONNECTION,
  },
  jwt: {
    TOKEN_NAME: process.env.JWT_TOKEN_NAME,
    SECRET_KEY: process.env.JWT_SECRET_KEY,
  },
  github: {
    CLIENT_SECRET: process.env.CLIENT_SECRET_GITHUB,
    CLIENT_ID: process.env.CLIENT_ID_GITHUB,
  },
  mailer: {
    USER: process.env.MAILER_USER,
    PASSWORD: process.env.MAILER_PASSWORD,
  },
};
