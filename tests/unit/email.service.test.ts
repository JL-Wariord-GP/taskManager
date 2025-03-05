//! src/tests/email.service.test.ts
import nodemailer from "nodemailer";
import { sendEmail } from "../../src/services/email.service";
import { config } from "../../src/config/config";

// Create mocks for nodemailer.
jest.mock("nodemailer");
jest.setTimeout(30000);

const sendMailMock = jest.fn();
const createTransportMock = nodemailer.createTransport as jest.Mock;

describe("Email Service Unit Tests", () => {
  beforeEach(() => {
    process.env.SKIP_EMAIL = "false";
    // Reset the mocks before each test.
    sendMailMock.mockReset();
    createTransportMock.mockReset();
    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  it("should send email successfully and return true", async () => {
    // Simulate a successful response from the sendMail method.
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
    // Simulate an error when sending the email.
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
