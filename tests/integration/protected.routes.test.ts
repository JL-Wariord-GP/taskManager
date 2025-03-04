//! tests/integration/protected.routes.test.ts

import request from "supertest";
import app from "../../src/app";
import { initializeTestDB, closeTestDB } from "../testSetup";

jest.setTimeout(30000);
describe("Protected Endpoints - Tasks API", () => {
  let mongoServer: any;
  let validToken: string;
  let dummyUserId: string;

  beforeAll(async () => {
    // Initializes the DB and obtains the authentication data required for the tests.
    const setup = await initializeTestDB();
    mongoServer = setup.mongoServer;
    dummyUserId = setup.dummyUserId;
    validToken = setup.validToken;
  });

  afterAll(async () => {
    // Closes the DB connection after completing the tests.
    await closeTestDB(mongoServer);
  });

  // CRUD tests for tasks are maintained. This block covers the creation, updating,
  // deletion, and retrieval of tasks through the API.

  describe("POST /api/tasks", () => {
    it("should create a new task via API", async () => {
      // Test data for a new task.
      const taskData = {
        title: "Nueva Tarea",
        description: "Descripción de la tarea",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      // Sends the POST request to create the task.
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`) // Uses the valid token for authentication.
        .set("Accept", "application/json")
        .send(taskData);

      // Verifies that the task was created correctly.
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
      // Data for a task to be updated.
      const taskData = {
        title: "Task to update",
        description: "Original description",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      // First, creates the task.
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      // Data to update the task.
      const updateData = {
        title: "Updated task title",
        completed: true,
      };

      // Performs the update of the task.
      const updateResponse = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(updateData);

      // Verifies that the task was updated correctly.
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
      // Data for a task that will be deleted.
      const taskData = {
        title: "Task to delete",
        description: "Task to be deleted",
        completed: false,
        dueDate: "2023-12-31T00:00:00.000Z",
      };

      // Creates the task.
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json")
        .send(taskData);

      expect(createResponse.status).toBe(201);
      const taskId = createResponse.body._id;

      // Deletes the created task.
      const deleteResponse = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      // Verifies that the task was deleted correctly.
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty(
        "message",
        "Task deleted successfully"
      );

      // Attempts to get the deleted task, which should return a 404 error.
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      expect(getResponse.status).toBe(404);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should retrieve a task by id via API", async () => {
      // Creates a task to be retrieved later.
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

      // Retrieves the created task by its ID.
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      // Verifies that the task data is correct.
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
      // Data for several tasks to test retrieval of the list.
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

      // Creates the necessary tasks for the test.
      for (const task of tasksData) {
        await request(app)
          .post("/api/tasks")
          .set("Authorization", `Bearer ${validToken}`)
          .set("Accept", "application/json")
          .send(task);
      }

      // Retrieves the list of tasks.
      const listResponse = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`)
        .set("Accept", "application/json");

      // Verifies that the response contains the expected list of tasks.
      expect(listResponse.status).toBe(200);
      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(listResponse.body.length).toBeGreaterThanOrEqual(tasksData.length);
    });
  });
});
