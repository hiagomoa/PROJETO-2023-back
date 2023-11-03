import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
interface ISendEmailProps {
  emailTemplatePath: string;
  body: Record<any, any>;
  from: string;
  to: string;
  subject: string;
}
export async function sendEmail({
  body,
  subject,
  emailTemplatePath,
  to,
  from,
}: ISendEmailProps): Promise<void> {
  const templateSource = fs.readFileSync(emailTemplatePath, "utf8");

  const compiledTemplate = handlebars.compile(templateSource);

  const renderedTemplate = compiledTemplate({ subject, ...body });

  const access = {
    host: process.env.EMAIL_HOST,
    port: 25,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 25,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000,
  });

  const emailOptions = {
    from,
    to,
    subject,
    html: renderedTemplate,
  };

  await transporter.sendMail(emailOptions);
}
