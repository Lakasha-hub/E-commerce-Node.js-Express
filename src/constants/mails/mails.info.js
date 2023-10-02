import { __dirname } from "../../utils.js";

export default {
  welcome: {
    subject: "Welcome! - Register in E-commerce",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/ninja-programming.png`,
        cid: "logo",
      },
    ],
  },
  restorePassword: {
    subject: "Restore Password",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/ninja-programming.png`,
        cid: "logo",
      },
    ],
  },
  purchase: {
    subject: "Receipt of your last purchase in Ecommerce",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/ninja-programming.png`,
        cid: "logo",
      },
    ],
  },
  deletedAccount: {
    subject: "Account deleted",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/ninja-programming.png`,
        cid: "logo",
      },
    ],
  },
  expiredAccount: {
    subject: "Account expired",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/ninja-programming.png`,
        cid: "logo",
      },
    ],
  },
  deletedProduct: {
    subject: "Product deleted",
    attachments: [
      {
        filename: "logo.png",
        path: `${__dirname}/public/img/ninja-programming.png`,
        cid: "logo",
      },
    ],
  },
};
