import fs from "fs";
import handlebars from "handlebars";
import { Resend } from "resend";
import { emailTemplateFolder } from "../../../server";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export type ResendProviderContract = {
  sendNewPassword(
    to: string,
    userName: string,
    password: string
  ): Promise<boolean>;

  sendForgotPassword(
    to: string,
    userName: string,
    password: string
  ): Promise<boolean>;
};

export class ResendExternalProvider implements ResendProviderContract {
  private from;
  constructor(private readonly resend: Resend) {
    this.from = `Sistema de Correção de Exercícios <${
      process.env.EMAIL_FROM as string
    }>`;
  }

  private generateTemplatePassword(userName: string, password: string): string {
    const emailTemplatePath = `${emailTemplateFolder}/create-password-template.hbs`;
    const templateSource = fs.readFileSync(emailTemplatePath, "utf8");

    const compiledTemplate = handlebars.compile(templateSource);

    const renderedTemplate = compiledTemplate({ password, userName });

    return renderedTemplate;
  }

  async sendNewPassword(
    to: string,
    userName: string,
    password: string
  ): Promise<boolean> {
    try {
      const template = this.generateTemplatePassword(userName, password);

      await this.resend.emails.send({
        from: this.from,
        to: [to],
        subject: "Nova senha",
        html: template,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async sendForgotPassword(
    to: string,
    userName: string,
    password: string
  ): Promise<boolean> {
    try {
      const template = this.generateTemplatePassword(userName, password);

      await this.resend.emails.send({
        from: this.from,
        to: [to],
        subject: "Recuperação de senha",
        html: template,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
export const ResendProvider = new ResendExternalProvider(resend);
