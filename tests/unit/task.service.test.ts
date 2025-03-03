import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import taskService from "../../src/services/task.service";
import Task from "../../src/models/task.model";
import connectDB from "../../src/config/database";

describe("Task Service", () => {
  let mongoServer: MongoMemoryServer;
  // Usamos un user id "dummy" para las pruebas unitarias
  let dummyUserId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    await connectDB();
    dummyUserId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it("should create a new task with valid data", async () => {
    const taskData = {
      title: "Nueva Tarea",
      description: "Descripción de la tarea",
      completed: false,
      dueDate: new Date("2023-12-31T00:00:00.000Z"),
      // Este campo se sobrescribe con dummyUserId
      user: new mongoose.Types.ObjectId(),
    };

    const createdTask = await taskService.createTask(taskData, dummyUserId);
    expect(createdTask).toBeDefined();
    expect(createdTask._id).toBeDefined();
    expect(createdTask.title).toBe(taskData.title);
    expect(createdTask.description).toBe(taskData.description);
    expect(createdTask.completed).toBe(false);
    expect(createdTask.dueDate.toISOString()).toBe(
      new Date("2023-12-31T00:00:00.000Z").toISOString()
    );
    expect(createdTask.user.toString()).toBe(dummyUserId);
  });

  it("should update a task with valid update data", async () => {
    const taskData = {
      title: "Tarea Inicial",
      description: "Descripción inicial",
      completed: false,
      dueDate: new Date("2023-12-31T00:00:00.000Z"),
      user: new mongoose.Types.ObjectId(),
    };

    const createdTask = await taskService.createTask(taskData, dummyUserId);
    expect(createdTask.title).toBe("Tarea Inicial");
    expect(createdTask.completed).toBe(false);

    const updateData = {
      title: "Tarea Actualizada",
      completed: true,
    };

    const updatedTask = await taskService.updateTask(
      (createdTask._id as mongoose.Types.ObjectId).toString(),
      updateData,
      dummyUserId
    );
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.title).toBe("Tarea Actualizada");
    expect(updatedTask?.completed).toBe(true);
    // La descripción y dueDate se mantienen sin cambios
    expect(updatedTask?.description).toBe("Descripción inicial");
    expect(updatedTask?.dueDate.toISOString()).toBe(
      new Date("2023-12-31T00:00:00.000Z").toISOString()
    );
  });

  it("should delete a task given a valid task ID", async () => {
    const taskData = {
      title: "Tarea a eliminar",
      description: "Esta tarea se eliminará",
      completed: false,
      dueDate: new Date("2023-12-31T00:00:00.000Z"),
      user: new mongoose.Types.ObjectId(),
    };

    const createdTask = await taskService.createTask(taskData, dummyUserId);
    expect(createdTask).toBeDefined();
    const createdTaskId = (
      createdTask._id as mongoose.Types.ObjectId
    ).toString();

    const deletedTask = await taskService.deleteTask(
      createdTaskId,
      dummyUserId
    );
    expect(deletedTask).toBeDefined();
    expect((deletedTask?._id as mongoose.Types.ObjectId).toString()).toBe(
      createdTaskId
    );

    const foundTask = await Task.findById(createdTaskId);
    expect(foundTask).toBeNull();
  });

  it("should retrieve a task by id", async () => {
    const taskData = {
      title: "Task for GET",
      description: "Description for GET test",
      completed: false,
      dueDate: new Date("2023-12-31T00:00:00.000Z"),
      user: new mongoose.Types.ObjectId(),
    };

    const createdTask = await taskService.createTask(taskData, dummyUserId);
    expect(createdTask).toBeDefined();
    const fetchedTask = await taskService.getTaskById(
      (createdTask._id as mongoose.Types.ObjectId).toString(),
      dummyUserId
    );
    expect(fetchedTask).toBeDefined();
    expect((fetchedTask?._id as mongoose.Types.ObjectId).toString()).toBe(
      (createdTask._id as mongoose.Types.ObjectId).toString()
    );
    expect(fetchedTask?.title).toBe(taskData.title);
    expect(fetchedTask?.description).toBe(taskData.description);
    expect(fetchedTask?.completed).toBe(taskData.completed);
    expect(fetchedTask?.dueDate.toISOString()).toBe(
      new Date("2023-12-31T00:00:00.000Z").toISOString()
    );
  });

  it("should retrieve a list of tasks for a given user", async () => {
    const tasksData = [
      {
        title: "Task 1",
        description: "Desc 1",
        completed: false,
        dueDate: new Date("2023-12-31T00:00:00.000Z"),
        user: new mongoose.Types.ObjectId(),
      },
      {
        title: "Task 2",
        description: "Desc 2",
        completed: true,
        dueDate: new Date("2023-12-31T00:00:00.000Z"),
        user: new mongoose.Types.ObjectId(),
      },
    ];
    for (const data of tasksData) {
      await taskService.createTask(data, dummyUserId);
    }

    const tasks = await taskService.getTasksByUser(dummyUserId);
    expect(tasks.length).toBeGreaterThanOrEqual(tasksData.length);
  });
});
