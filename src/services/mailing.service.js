import nodemailer from "nodemailer";

import environmentOptions from "../constants/server/environment.options.js";
import mailsInfo from "../constants/mails/mails.info.js";
import { generateMailTemplate } from "../utils.js";

export default class MailingService {
  constructor() {
    this.mailer = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: environmentOptions.mailer.USER,
        pass: environmentOptions.mailer.PASSWORD,
      },
    });
  }

  sendMail = async (emails, template, payload) => {
    const mailInfo = mailsInfo[template];
    const html = await generateMailTemplate(template, payload);
    const mail = await this.mailer.sendMail({
      from: "E-commerce - Lakasha-hub <lautaromoreira722@gmail.com>",
      to: emails,
      html,
      ...mailInfo,
    });
    return mail;
  };
}
