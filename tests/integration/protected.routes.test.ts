import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/app";
import connectDB from "../../src/config/database";
import { signToken } from "../../src/utils/jwt.util";

describe("Protected Endpoints - Tasks API", () => {
  let mongoServer: MongoMemoryServer;
  let validToken: string;
  let dummyUserId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    await connectDB();

    // Creamos un usuario dummy y generamos el token
    dummyUserId = new mongoose.Types.ObjectId().toString();
    validToken = signToken({ id: dummyUserId, role: "user" });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe("POST /api/tasks", () => {
    it("should create a new task via API", async () => {
      const taskData = {
        title: "Nueva Tarea",
        description: "Descripción de la tarea",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe(taskData.title);
      expect(res.body.description).toBe(taskData.description);
      expect(res.body.completed).toBe(false);
      expect(new Date(res.body.dueDate).toISOString()).toBe(taskData.dueDate);
      expect(res.body.user).toBe(dummyUserId);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update an existing task via API", async () => {
      const taskData = {
        title: "Task to update",
        description: "Original description",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      const updateData = {
        title: "Updated task title",
        completed: true,
      };

      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toHaveProperty("task");
      expect(updateResponse.body.task).toHaveProperty("_id", taskId);
      expect(updateResponse.body.task.title).toBe(updateData.title);
      expect(updateResponse.body.task.completed).toBe(updateData.completed);
      // Se mantiene la descripción y la fecha original
      expect(updateResponse.body.task.description).toBe(taskData.description);
      expect(new Date(updateResponse.body.task.dueDate).toISOString()).toBe(
        taskData.dueDate
      );
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task via API", async () => {
      const taskData = {
        title: "Task to delete",
        description: "Task to be deleted",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty(
        "message",
        "Task deleted successfully"
      );

      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      expect(getResponse.status).toBe(404);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should retrieve a task by id via API", async () => {
      const taskData = {
        title: "Task for GET",
        description: "Description for GET API test",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveProperty("_id", taskId);
      expect(getResponse.body.title).toBe(taskData.title);
      expect(getResponse.body.description).toBe(taskData.description);
      expect(getResponse.body.completed).toBe(taskData.completed);
      expect(new Date(getResponse.body.dueDate).toISOString()).toBe(
        taskData.dueDate
      );
    });
  });

  describe("GET /api/tasks", () => {
    it("should retrieve a list of tasks for the authenticated user", async () => {
      const tasksData = [
        {
          title: "Task List 1",
          description: "Desc 1",
          completed: false,
          dueDate: "2023-12-31T00:00:00.000Z",
        },
        {
          title: "Task List 2",
          description: "Desc 2",
          completed: true,
          dueDate: "2023-12-31T00:00:00.000Z",
        },
      ];

      for (const task of tasksData) {
        await request(app)
          .post("/api/tasks")
          .set("Authorization", `Bearer ${validToken}`)
          .set("Accept", "application/json")
          .send(task);
      }

      const listResponse = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      expect(listResponse.status).toBe(200);
      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body.length).toBeGreaterThanOrEqual(tasksData.length);
    });
  });
});
