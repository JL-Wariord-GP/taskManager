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
    const info = await transporter.sendMail(message);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false; 
  }
};
