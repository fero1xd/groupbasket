import sgMail from "@sendgrid/mail";
import { env } from "../env";

sgMail.setApiKey(env.SENDGRID_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};
const from = {
  name: "Group Basket",
  email: "pranjalbutola12@gmail.com", // Change to your verified sender
};

export const sendEmail = async (
  params: SendEmailParams | SendEmailParams[]
) => {
  const msg = Array.isArray(params)
    ? params.map((p) => ({ from, ...p }))
    : [
        {
          from,
          ...params,
        },
      ];

  await sgMail.send(msg, true);
};
