import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../../src/config/database";

describe("Database Connection", () => {
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
    // Hacemos la desconexion mongoose y detenemos el servidor en memoria
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should connect to the in-memory database", async () => {
    // Se hace la verificacion que la conexión esté activa (readyState === 1 indica conectado)
    expect(mongoose.connection.readyState).toBe(1);
  });
});
