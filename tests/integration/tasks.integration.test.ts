import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/app";
import connectDB from "../../src/config/database";

describe("Tasks API - Create Task", () => {
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
    // Limpia y cierra la conexión al finalizar.
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Aquí se pueden limpiar otras colecciones si fuese necesario.
  });

  it("should create a new task via API", async () => {
    // Datos de prueba para la tarea.
    const taskData = {
      title: "Nueva Tarea",
      description: "Descripción de la tarea",
      completed: false,
      // Simulamos el ID de un usuario en formato string.
      user: new mongoose.Types.ObjectId().toString(),
    };

    // Realizamos una petición POST al endpoint para crear tareas.
    const res = await request(app)
      .post("/api/tasks") 
      .send(taskData)
      .set("Accept", "application/json");

    // Validamos la respuesta:
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(taskData.title);
    expect(res.body.description).toBe(taskData.description);
    expect(res.body.completed).toBe(false);
  });
});
