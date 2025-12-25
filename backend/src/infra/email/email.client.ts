import { createTransport } from "nodemailer";
import logger from "../logger/logger.js";

export const emailClient = createTransport({
  host: process.env["SMTP_HOST"],
  port: 587,
  auth: {
    user: process.env["SMTP_USER"],
    pass: process.env["SMTP_PASS"],
  },
});

emailClient.verify().then(() => {
  logger.info("Email Server is ready to take our messages");
});
