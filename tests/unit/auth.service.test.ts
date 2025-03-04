// tests/services/auth.service.test.ts
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userService from "../../src/services/user.service";
import User from "../../src/models/user.model";
import connectDB from "../../src/config/database";
import * as authService from "../../src/services/auth.service";


describe("Auth Service - Login", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Creamos la instancia en memoria de MongoDB
    mongoServer = await MongoMemoryServer.create();
    // Sobreescribimos la variable de entorno con la URI del MongoMemoryServer
    process.env.MONGO_URI = mongoServer.getUri();
    // Nos conectamos usando la función de conexión
    await connectDB();
  });

  afterAll(async () => {
    // Limpia la base de datos y detén el servidor en memoria
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Asegura un entorno limpio antes de cada prueba
    await User.deleteMany({});
  });

  it("should login successfully with valid credentials", async () => {
    // Datos de un usuario válido
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
    };

    // Crea el usuario (el servicio de usuario se encarga de encriptar la contraseña)
    await userService.createUser(userData);

    // Se intenta iniciar sesión con las credenciales correctas
    const result = await authService.loginUser({
      email: userData.email,
      password: userData.password,
    });

    // Se espera que el resultado contenga un token y la información del usuario
    expect(result).toHaveProperty("token");
    expect(result.user.email).toBe(userData.email);
  });

  it("should fail login with incorrect password", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
    };

    // Crea el usuario
    await userService.createUser(userData);

    // Intentamos loguearnos con una contraseña incorrecta y se espera un error
    await expect(
      authService.loginUser({
        email: userData.email,
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should fail login if user does not exist", async () => {
    // Se intenta iniciar sesión con un email que no existe en la base de datos
    await expect(
      authService.loginUser({
        email: "nonexistent@example.com",
        password: "anyPassword",
      })
    ).rejects.toThrow("User not found");
  });
});
