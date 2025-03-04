//! src/controllers/auth.controller.ts

import { Request, Response } from "express";
import User from "../models/user.model";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../services/auth.service";
import { sendEmail } from "../services/email.service";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface TokenPayload {
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * Registers a new user.
 * In addition to the existing logic (including role validation),
 * an email verification is sent with a link to activate the account.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterRequestBody;

    // Check if the email is already in use
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      res.status(400).json({ message: "User or email already in use" });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user with 'verified' set to false by default
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    await newUser.save();

    // Generate a verification token (valid for 24 hours)
    const verificationToken = jwt.sign({ id: newUser._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    // Construct the verification link using the request protocol and host
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify?token=${verificationToken}`;

    // Prepare the verification email
    const emailOptions = {
      to: email,
      subject: "Task Management System - Account Verification",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for registering with our system. To complete your registration and activate your account, please click the following link:</p>
        <p><a href="${verificationLink}">Verify my account</a></p>
        <p>If you did not request this registration, please ignore this message.</p>
        <p>Best regards,<br/>Developer Jorge Gomez</p>
      `,
    };

    const emailSent = await sendEmail(emailOptions);

    if (emailSent) {
      res.status(201).json({
        message:
          "User successfully registered. Please check your inbox to verify your account.",
      });
    } else {
      // If sending the email fails, delete the newly created user
      await User.findByIdAndDelete(newUser._id);
      res.status(500).json({
        message:
          "Error sending verification email. The user was not created. Please try again later.",
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Verifies the user's account using the token sent via email.
 */
export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    res.status(400).json({ message: "Verification token not provided." });
    return;
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    const userId = decoded.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json({
      message: "Email successfully verified. Your account is now activated.",
    });
  } catch (error: any) {
    res.status(400).json({ message: "Invalid or expired verification token." });
  }
};

/**
 * Logs in and returns a JWT token.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequestBody;
    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      res.status(400).json({ message: "Incorrect credentials" });
      return;
    }
    // Check if the account is activated
    if (!user.verified) {
      res.status(403).json({
        message:
          "Account not verified. Please check your email and verify your account to use our services.",
      });
      return;
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
