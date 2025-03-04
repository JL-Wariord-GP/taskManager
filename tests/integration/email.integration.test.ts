//! src/tests/email.integration.test.ts

import nodemailer from "nodemailer";
import { sendEmail } from "../../src/services/email.service";
import { config } from "../../src/config/config";

jest.setTimeout(30000);
describe("Email Integration Tests", () => {
  beforeAll(async () => {
    // Create an Ethereal test account and override the email configuration.
    const testAccount = await nodemailer.createTestAccount();

    // Update the email configuration for the testing environment.
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
