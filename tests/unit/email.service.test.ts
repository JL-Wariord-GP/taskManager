// src/tests/email.service.test.ts
import nodemailer from "nodemailer";
import { sendEmail } from "../../src/services/email.service";
import { config } from "../../src/config/config";

// Creamos mocks para nodemailer
jest.mock("nodemailer");

const sendMailMock = jest.fn();
const createTransportMock = nodemailer.createTransport as jest.Mock;

describe("Email Service Unit Tests", () => {
  beforeEach(() => {
    // Reiniciamos los mocks antes de cada prueba
    sendMailMock.mockReset();
    createTransportMock.mockReset();
    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  it("should send email successfully and return true", async () => {
    // Simulamos una respuesta exitosa del método sendMail
    sendMailMock.mockResolvedValue({ messageId: "12345" });

    const emailOptions = {
      to: "test@example.com",
      subject: "Test Subject",
      html: "<p>Test Email</p>",
    };

    const result = await sendEmail(emailOptions);

    expect(result).toBe(true);
    expect(createTransportMock).toHaveBeenCalledWith({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: `"${config.email.fromName}" <${config.email.user}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
    });
  });

  it("should return false when sending email fails", async () => {
    // Simulamos un error al enviar el correo
    sendMailMock.mockRejectedValue(new Error("SMTP error"));

    const emailOptions = {
      to: "test@example.com",
      subject: "Test Subject",
      html: "<p>Test Email</p>",
    };

    const result = await sendEmail(emailOptions);
    expect(result).toBe(false);
  });
});
