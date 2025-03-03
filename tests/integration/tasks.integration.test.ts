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

describe("Tasks API - Delete Task", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should delete a task via API", async () => {
    // Creamos una tarea primero a través del endpoint POST
    const taskData = {
      title: "Tarea a eliminar vía API",
      description: "Esta tarea se eliminará vía API",
      completed: false,
      user: new mongoose.Types.ObjectId().toString(),
    };

    const resCreate = await request(app)
      .post("/api/tasks")
      .send(taskData)
      .set("Accept", "application/json");

    expect(resCreate.status).toBe(201);
    const taskId = resCreate.body._id;

    // Llamamos al endpoint DELETE para eliminar la tarea
    const resDelete = await request(app).delete(`/api/tasks/${taskId}`);
    expect(resDelete.status).toBe(200);
    expect(resDelete.body).toHaveProperty(
      "message",
      "Task deleted successfully"
    );

    // Opcional: Verificamos que la tarea no exista en la base de datos
    const resGet = await request(app).get(`/api/tasks/${taskId}`);
    expect(resGet.status).toBe(404);
  });
});

describe("Tasks API - Get Task", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should retrieve a task via API", async () => {
    // Datos de prueba para crear una tarea.
    const taskData = {
      title: "Task for GET via API",
      description: "Description for GET API test",
      completed: false,
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

    // Realizamos la petición GET al endpoint para obtener la tarea
    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Accept", "application/json");

    // Validamos la respuesta: se espera status 200 y que los datos coincidan
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty("_id", taskId);
    expect(getResponse.body.title).toBe(taskData.title);
    expect(getResponse.body.description).toBe(taskData.description);
    expect(getResponse.body.completed).toBe(taskData.completed);
  });

  it("should retrieve a list of tasks via API", async () => {
    // Creamos dos tareas
    const tasksData = [
      {
        title: "Task List 1",
        description: "Desc 1",
        completed: false,
        user: new mongoose.Types.ObjectId().toString(),
      },
      {
        title: "Task List 2",
        description: "Desc 2",
        completed: true,
        user: new mongoose.Types.ObjectId().toString(),
      },
    ];

    for (const task of tasksData) {
      await request(app)
        .post("/api/tasks")
        .send(task)
        .set("Accept", "application/json");
    }

    // Realizamos la petición GET al endpoint de lista de tareas
    const listResponse = await request(app)
      .get("/api/tasks")
      .set("Accept", "application/json");

    expect(listResponse.status).toBe(200);
    // Suponiendo que el endpoint retorna un array de tareas
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.length).toBeGreaterThanOrEqual(tasksData.length);
  });
});