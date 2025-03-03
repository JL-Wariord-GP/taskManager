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

describe("Tasks API - Update Task", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Levantamos la instancia en memoria de MongoDB
    mongoServer = await MongoMemoryServer.create();
    // Sobreescribimos la variable de entorno con la URI del MongoMemoryServer
    process.env.MONGO_URI = mongoServer.getUri();
    // Nos conectamos usando la función de conexión
    await connectDB();
  });

  afterAll(async () => {
    // Limpia y cierra la conexión al finalizar
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should update a task via API", async () => {
    // Datos de prueba para crear una tarea
    const taskData = {
      title: "Task to update",
      description: "Original description",
      completed: false,
      // Simulamos el ID de un usuario en formato string
      user: new mongoose.Types.ObjectId().toString(),
    };

    // Creamos la tarea mediante el endpoint POST
    const createResponse = await request(app)
      .post("/api/tasks")
      .send(taskData)
      .set("Accept", "application/json");

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty("_id");
    const taskId = createResponse.body._id;

    // Datos de actualización: modificamos el título y el estado
    const updateData = {
      title: "Updated task title",
      completed: true,
    };

    // Realizamos la petición PUT al endpoint de actualización
    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send(updateData)
      .set("Accept", "application/json");

    // Validamos la respuesta
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty("task._id", taskId);
    expect(updateResponse.body.task.title).toBe(updateData.title);
    expect(updateResponse.body.task.completed).toBe(updateData.completed);
    // Se espera que la descripción permanezca igual a la original
    expect(updateResponse.body.task.description).toBe(taskData.description);
  });
});
