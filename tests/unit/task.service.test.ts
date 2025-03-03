import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import taskService from "../../src/services/task.service";
import Task from "../../src/models/task.model";
import connectDB from "../../src/config/database";

describe("Task Service - Create Task", () => {
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
    // Limpia y cierra la conexión al finalizar las pruebas.
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Eliminamos todas las tareas antes de cada test para tener un entorno aislado.
    await Task.deleteMany({});
  });

  it("should create a new task with valid data", async () => {
    // Datos de prueba para la tarea.
    const taskData = {
      title: "Nueva Tarea",
      description: "Descripción de la tarea",
      completed: false,
      // Simulamos el ID de un usuario (el propietario de la tarea).
      user: new mongoose.Types.ObjectId(),
    };

    // Se invoca el método del servicio que debe crear la tarea.
    const createdTask = await taskService.createTask(taskData);

    // Validaciones:
    expect(createdTask).toBeDefined();
    expect(createdTask._id).toBeDefined();
    expect(createdTask.title).toBe(taskData.title);
    expect(createdTask.description).toBe(taskData.description);
    expect(createdTask.completed).toBe(false);
  });
});

describe("Task Service - Update Task", () => {
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

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it("should update a task with valid update data", async () => {
    // Creamos una tarea inicial
    const taskData = {
      title: "Tarea Inicial",
      description: "Descripción inicial",
      completed: false,
      user: new mongoose.Types.ObjectId(),
    };

    const createdTask = await taskService.createTask(taskData);
    expect(createdTask).toBeDefined();
    // Se asegura que la tarea tenga los datos iniciales
    expect(createdTask.title).toBe("Tarea Inicial");
    expect(createdTask.completed).toBe(false);

    // Datos de actualización (modificamos el título y el estado)
    const updateData = {
      title: "Tarea Actualizada",
      completed: true,
    };

    // Llamamos al servicio de actualización pasándole el ID de la tarea y los datos de actualización
    const updatedTask = await taskService.updateTask(
      createdTask._id as mongoose.Types.ObjectId,
      updateData
    );
    expect(updatedTask).toBeDefined();
    // Validamos que los campos se hayan actualizado
    expect(updatedTask?.title).toBe("Tarea Actualizada");
    expect(updatedTask?.completed).toBe(true);
    // Se espera que la descripción no cambie
    expect(updatedTask?.description).toBe("Descripción inicial");
  });
});
