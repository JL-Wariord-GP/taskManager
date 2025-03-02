import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userService from "../../src/services/user.service";
import User from "../../src/models/user.model";
import connectDB from "../../src/config/database";

describe("User Service", () => {
  let mongoServer: MongoMemoryServer;


  beforeAll(async () => {
    // Creamos  la instancia en memoria de MongoDB
    mongoServer = await MongoMemoryServer.create();
    // Sobreescribimos la variable de entorno con la URI del MongoMemoryServer
    process.env.MONGO_URI = mongoServer.getUri();
    // Nos conectamos usando la función de conexión
    await connectDB();
  });

  afterAll(async () => {
    // Limpiamos la base de datos y cerramos la conexión
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Eliminamos todos los documentos del modelo User antes de cada prueba
    await User.deleteMany({});
  });

  it("should create a new user with valid data", async () => {
    const userData = {
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "securepassword",
    };

    // Llamamos al servicio para crear el usuario
    const newUser = await userService.createUser(userData);

    // Verificamos que se haya creado el usuario correctamente
    expect(newUser).toBeDefined();
    expect(newUser._id).toBeDefined();
    expect(newUser.name).toBe(userData.name);
    expect(newUser.email).toBe(userData.email);
    // Aquí podrías agregar más validaciones, por ejemplo, que la contraseña esté encriptada
  });
});
