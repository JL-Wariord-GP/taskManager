//! src/services/email.service.ts

import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { config } from "../config/config";

// Interface defining the structure of email options
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the configured SMTP service.
 * @param emailOptions - Options for sending the email.
 * @param emailOptions.to - Recipient's email address.
 * @param emailOptions.subject - Subject of the email.
 * @param emailOptions.html - HTML content of the email.
 * @returns Returns true if the email was sent successfully, false if an error occurred.
 */
export const sendEmail = async (
  emailOptions: EmailOptions
): Promise<boolean> => {
  try {
    // Check if the environment is test to avoid actual email sending during tests.
    if (process.env.NODE_ENV === "test" && process.env.SKIP_EMAIL === "true") {
      console.log("Test environment detected - skipping email sending.");
      return true;
    }

    // Create a transporter using the config settings
    const transporter: Transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    // Set up the email message
    const message: SendMailOptions = {
      from: `"${config.email.fromName}" <${config.email.user}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
    };

    // Send the email
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Error sending email:", error);
    }
    return false;
  }
};
