import { fileURLToPath } from "url";
import { dirname } from "path";
import environmentOptions from "./constants/server/environment.options.js";
import fs from "fs";
import Handlebars from "handlebars";

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[environmentOptions.jwt.TOKEN_NAME];
  }
  return token;
};

export const generateMailTemplate = async (template, payload) => {
  const content = await fs.promises.readFile(
    `${__dirname}/templates/${template}.handlebars`
  );
  const preCompiledContent = Handlebars.compile(content.toString("utf-8"));
  //Send content with context/payload (user, product, etc..)
  const compiledContent = preCompiledContent(payload);
  return compiledContent;
};

export const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let string = "";
  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string;
};

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
