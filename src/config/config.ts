

import dotenv from "dotenv";

dotenv.config();

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
}

interface Config {
  port: number;
  jwtSecret: string;
  email: EmailConfig;
}

export const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    user: process.env.EMAIL_USER || "example@gmail.com",
    pass: process.env.EMAIL_PASS || "clavesecreta",
    fromName: process.env.EMAIL_FROM_NAME || "Autenticacion",
  },
};
