//! tests/services/task.service.test.ts

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import taskService from "../../src/services/task.service";
import Task from "../../src/models/task.model";
import { initializeTestDB, closeTestDB } from "../testSetup";

/**
 * Integration tests for the task service.
 * Uses an in-memory database to test CRUD operations without affecting production data.
 */
jest.setTimeout(30000);
describe("Task Service", () => {
  let mongoServer: MongoMemoryServer;
  // Dummy user ID used for testing.
  let dummyUserId: string;

  beforeAll(async () => {
    const setup = await initializeTestDB();
    mongoServer = setup.mongoServer;
    dummyUserId = setup.dummyUserId;
  });

  afterAll(async () => {
    await closeTestDB(mongoServer);
  });

  beforeEach(async () => {
    // Remove all tasks before each test to ensure a clean slate.
    await Task.deleteMany({});
  });

  it("should create a new task with valid data", async () => {
    const taskData = {
      title: "Nueva Tarea",
      description: "Descripción de la tarea",
      completed: false,
      dueDate: new Date("2023-12-31T00:00:00.000Z"),
      // This field is overwritten by dummyUserId in the service.
      user: new mongoose.Types.ObjectId(),
    };

    // Create the task using the service, which assigns the dummy user ID.
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

    // Create the initial task.
    const createdTask = await taskService.createTask(taskData, dummyUserId);
    expect(createdTask.title).toBe("Tarea Inicial");
    expect(createdTask.completed).toBe(false);

    const updateData = {
      title: "Tarea Actualizada",
      completed: true,
    };

    // Update the task with new data.
    const updatedTask = await taskService.updateTask(
      (createdTask._id as mongoose.Types.ObjectId).toString(),
      updateData,
      dummyUserId
    );
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.title).toBe("Tarea Actualizada");
    expect(updatedTask?.completed).toBe(true);
    // Verify that description and dueDate remain unchanged.
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

    // Create a task to be deleted.
    const createdTask = await taskService.createTask(taskData, dummyUserId);
    expect(createdTask).toBeDefined();
    const createdTaskId = (
      createdTask._id as mongoose.Types.ObjectId
    ).toString();

    // Delete the task using the service.
    const deletedTask = await taskService.deleteTask(
      createdTaskId,
      dummyUserId
    );
    expect(deletedTask).toBeDefined();
    expect((deletedTask?._id as mongoose.Types.ObjectId).toString()).toBe(
      createdTaskId
    );

    // Verify that the task no longer exists.
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

    // Create the task and then retrieve it.
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

    // Create multiple tasks for testing the list endpoint.
    for (const data of tasksData) {
      await taskService.createTask(data, dummyUserId);
    }

    const tasks = await taskService.getTasksByUser(dummyUserId);
    expect(tasks.length).toBeGreaterThanOrEqual(tasksData.length);
  });
});
