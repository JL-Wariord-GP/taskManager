// src/tests/email.integration.test.ts
import nodemailer from "nodemailer";
import { sendEmail } from "../../src/services/email.service";
import { config } from "../../src/config/config";

describe("Email Integration Tests", () => {
  beforeAll(async () => {
    // Crear una cuenta de prueba Ethereal y sobreescribir la configuración de email
    const testAccount = await nodemailer.createTestAccount();

    // Actualizamos la configuración de email para el entorno de pruebas
    config.email.host = "smtp.ethereal.email";
    config.email.port = 587;
    config.email.user = testAccount.user;
    config.email.pass = testAccount.pass;
    config.email.fromName = "Test Sender";
  });

  it("should send an email using Ethereal and return true", async () => {
    const emailOptions = {
      to: "recipient@example.com",
      subject: "Integration Test Email",
      html: "<p>This is a test email from integration tests.</p>",
    };

    const result = await sendEmail(emailOptions);
    expect(result).toBe(true);
  });
});
