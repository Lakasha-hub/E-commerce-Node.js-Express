import { fileURLToPath } from "url";
import { dirname } from "path";
import environmentOptions from "./constants/server/environment.options.js";

export const generateCodeRandom = (codeLength) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }
  return randomCode;
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[environmentOptions.jwt.TOKEN_NAME];
  }
  return token;
};

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
