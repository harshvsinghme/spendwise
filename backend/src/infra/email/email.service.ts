import logger from "../logger/logger.js";
import { emailClient } from "./email.client.js";
import { BUDGET_WARNING, budgetWarningTemplate } from "./templates/budget-warning.js";
import { RESET_PASSWORD, resetPasswordTemplate } from "./templates/reset-password.js";

export function sendEmail({
  template,
  data,
  recipients,
}: {
  template: string;
  data: Record<string, unknown>;
  recipients: Array<string>;
}) {
  let subject = `Spendwise`;
  switch (template) {
    case RESET_PASSWORD:
      subject = `Reset Password for Spendwise`;
      template = resetPasswordTemplate(data["name"] ?? "", data["link"] ?? "");
      break;

    case BUDGET_WARNING:
      subject = `Budget Warning from Spendwise`;
      template = budgetWarningTemplate(
        data["name"] ?? "",
        data["utilisedPercentage"] ?? 0,
        data["month"] ?? "",
        data["year"] ?? 0
      );
      break;

    default:
      break;
  }

  emailClient
    .sendMail({
      from: "hvsreal.223@gmail.com",
      to: recipients,
      subject,
      html: template,
    })
    .then((info) => {
      logger.info("Email sent: %s", info.messageId);
    });
}
