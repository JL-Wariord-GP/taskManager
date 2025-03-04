// src/services/email.service.ts
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { config } from "../config/config";

// Definimos una interfaz para las opciones del correo
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un email utilizando el servicio SMTP configurado.
 * @param emailOptions - Opciones del email.
 * @param emailOptions.to - Correo del destinatario.
 * @param emailOptions.subject - Asunto del mensaje.
 * @param emailOptions.html - Contenido HTML del mensaje.
 * @returns Retorna true si se envió correctamente; false en caso de error.
 */
export const sendEmail = async (
  emailOptions: EmailOptions
): Promise<boolean> => {
  try {
    // Crear el transportador utilizando las configuraciones del archivo config
    const transporter: Transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true para 465, false para otros puertos
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    // Configuración del mensaje a enviar
    const message: SendMailOptions = {
      from: `"${config.email.fromName}" <${config.email.user}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
    };

    // Enviar el correo
    const info = await transporter.sendMail(message);
    console.log("Email enviado: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error al enviar email:", error);
    return false;
  }
};
