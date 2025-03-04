//! tests/integration/taks.integration.test.ts

import request from "supertest";
import app from "../../src/app";
import { initializeTestDB, closeTestDB } from "../testSetup";

jest.setTimeout(30000);
describe("Tasks API Integration Tests", () => {
  let mongoServer: any;
  let validToken: string;
  let dummyUserId: string;

  beforeAll(async () => {
    // Initializes the DB and obtains the test authentication data.
    const setup = await initializeTestDB();
    mongoServer = setup.mongoServer;
    dummyUserId = setup.dummyUserId;
    validToken = setup.validToken;
  });

  afterAll(async () => {
    // Closes the test DB after all tests have been executed.
    await closeTestDB(mongoServer);
  });

  describe("POST /api/tasks", () => {
    it("should create a new task via API", async () => {
      // Data for the new task to be sent.
      const taskData = {
        title: "Nueva Tarea",
        description: "Descripción de la tarea",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      // Sends the POST request to create a new task.
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      // Validates the response.
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe(taskData.title);
      expect(res.body.description).toBe(taskData.description);
      expect(res.body.completed).toBe(false);
      expect(new Date(res.body.dueDate).toISOString()).toBe(taskData.dueDate);

      // Verifies that the task has been associated with the correct user.
      expect(res.body.user).toBe(dummyUserId);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update an existing task via API", async () => {
      // Data for the initial task to be created.
      const taskData = {
        title: "Task to update",
        description: "Original description",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      // First, creates the task to be updated.
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      // Update data for the task.
      const updateData = {
        title: "Updated task title",
        completed: true,
      };

      // Sends the PUT request to update the task.
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(updateData);

      // Validates that the task has been updated correctly.
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toHaveProperty("task");
      expect(updateResponse.body.task).toHaveProperty("_id", taskId);
      expect(updateResponse.body.task.title).toBe(updateData.title);
      expect(updateResponse.body.task.completed).toBe(updateData.completed);
      expect(updateResponse.body.task.description).toBe(taskData.description);
      expect(new Date(updateResponse.body.task.dueDate).toISOString()).toBe(
        taskData.dueDate
      );
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task via API", async () => {
      // Data for the task to be deleted.
      const taskData = {
        title: "Task to delete",
        description: "Task to be deleted",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      // Creates the task that will later be deleted.
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      // Sends the DELETE request to delete the task.
      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      // Validates that the task was successfully deleted.
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty(
        "message",
        "Task deleted successfully"
      );

      // Verifies that the task no longer exists when attempting to retrieve it.
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      // The deleted task should not exist, so it should return a 404.
      expect(getResponse.status).toBe(404);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should retrieve a task by id via API", async () => {
      // Data for the task to be retrieved by ID.
      const taskData = {
        title: "Task for GET",
        description: "Description for GET API test",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      // Creates the task that will later be retrieved.
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      // Sends the GET request to retrieve the task by ID.
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      // Validates that the retrieved task matches the sent data.
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
      // List of tasks to be created to test retrieval of multiple tasks.
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

      // Creates several tasks to test retrieval.
      for (const task of tasksData) {
        await request(app)
          .post("/api/tasks")
          .set("Authorization", `Bearer ${validToken}`)
          .set("Accept", "application/json")
          .send(task);
      }

      // Sends the GET request to retrieve all tasks of the authenticated user.
      const listResponse = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      // Validates that the response is a list and contains at least the created tasks.
      expect(listResponse.status).toBe(200);
      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body.length).toBeGreaterThanOrEqual(tasksData.length);
    });
  });
});
