//! tests/services/auth.service.test.ts

import { MongoMemoryServer } from "mongodb-memory-server";
import userService from "../../src/services/user.service";
import User from "../../src/models/user.model";
import * as authService from "../../src/services/auth.service";
import { initializeTestDB, closeTestDB } from "../testSetup";

/**
 * Integration tests for the authentication service (login functionality).
 * Uses an in-memory MongoDB instance to ensure isolated test runs.
 */
jest.setTimeout(30000);
describe("Auth Service - Login", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Initialize the in-memory database using the helper.
    const setup = await initializeTestDB();
    mongoServer = setup.mongoServer;
  });

  afterAll(async () => {
    // Clean up the database and stop the in-memory server using the helper.
    await closeTestDB(mongoServer);
  });

  beforeEach(async () => {
    // Ensure a clean environment by removing all User documents before each test.
    await User.deleteMany({});
  });

  it("should login successfully with valid credentials", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
    };

    // Create the user; the service handles password encryption.
    await userService.createUser(userData);

    // Attempt to log in with correct credentials.
    const result = await authService.loginUser({
      email: userData.email,
      password: userData.password,
    });

    // Expect the result to include a token and the correct user information.
    expect(result).toHaveProperty("token");
    expect(result.user.email).toBe(userData.email);
  });

  it("should fail login with incorrect password", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
    };

    // Create the user.
    await userService.createUser(userData);

    // Attempt to log in with an incorrect password and expect an error.
    await expect(
      authService.loginUser({
        email: userData.email,
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should fail login if user does not exist", async () => {
    // Attempt to log in with an email that does not exist.
    await expect(
      authService.loginUser({
        email: "nonexistent@example.com",
        password: "anyPassword",
      })
    ).rejects.toThrow("User not found");
  });
});
