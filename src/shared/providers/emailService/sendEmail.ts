import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
interface ISendEmailProps {
  emailTemplatePath: string;
  body: Record<any, any>;
  from: string;
  to: string;
  subject: string
}
export async function sendEmail({ body, subject, emailTemplatePath, to, from }: ISendEmailProps): Promise<void> {


  const templateSource = fs.readFileSync(emailTemplatePath, 'utf8');


  const compiledTemplate = handlebars.compile(templateSource);

  const renderedTemplate = compiledTemplate({ subject, ...body, });

  const access = {
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }

  const transporter = nodemailer.createTransport(access);

  const emailOptions = {
    from,
    to,
    subject,
    html: renderedTemplate,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log('email sended')
  } catch (error) {
    console.log("ERROR EMAIL SEND, INIT")
    console.error(error);
    console.log("ERROR EMAIL SEND, END")
  }
}

