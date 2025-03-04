// src/controllers/authController.ts

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
 * Registra un nuevo usuario.
 * Además de la lógica existente (incluyendo la validación del rol),
 * se envía un email de verificación con un enlace para activar la cuenta.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterRequestBody;

    // Verificar si el email ya están en uso
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      res.status(400).json({ message: "El usuario o email ya están en uso" });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear el usuario con verified por defecto en false
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    await newUser.save();

    // Generar token de verificación (válido por 24 horas)
    const verificationToken = jwt.sign({ id: newUser._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    //Construir el enlace de verificación usando el protocolo y host de la petición
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify?token=${verificationToken}`;

    // Preparar el email de verificación
    const emailOptions = {
      to: email,
      subject: "Sistema de Gestión de Tareas - Verificación de cuenta",
      html: `
        <p>Estimado/a ${name},</p>
        <p>Gracias por registrarse en nuestro sistema. Para completar su registro y activar su cuenta, por favor haga clic en el siguiente enlace:</p>
        <p><a href="${verificationLink}">Verificar mi cuenta</a></p>
        <p>Si usted no ha solicitado este registro, por favor ignore este mensaje.</p>
        <p>Atentamente,<br/>Developer Jorge Gomez</p>
      `,
    };

    const emailSent = await sendEmail(emailOptions);
    if (emailSent) {
      res.status(201).json({
        message:
          "Usuario registrado exitosamente. Por favor, revise su bandeja de entrada para validar su cuenta.",
      });
    } else {
      res.status(500).json({
        message:
          "Usuario registrado, pero ocurrió un error al enviar el email de verificación.",
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

/**
 * Verifica la cuenta del usuario a partir del token enviado por email.
 */
export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.query;
  console.log("Ruta /verify llamada. Query:", req.query);
  if (!token || typeof token !== "string") {
    res
      .status(400)
      .json({ message: "Token de verificación no proporcionado." });
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
      res.status(404).json({ message: "Usuario no encontrado." });
      return;
    }
    res.status(200).json({
      message: "Email verificado exitosamente. Su cuenta ahora está activada.",
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Token de verificación inválido o expirado." });
  }
};

/**
 * Inicia sesión y retorna un token JWT.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequestBody;
    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      res.status(400).json({ message: "Credenciales incorrectas" });
      return;
    }
    // Verificar que la cuenta esté activada
    if (!user.verified) {
      res.status(403).json({
        message:
          "Cuenta no verificada. Por favor, revise su email y verifique su cuenta para poder usar nuestros servicios.",
      });
      return;
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
