//! tests/services/user.service.test.ts

import bcrypt from "bcrypt";
import { MongoMemoryServer } from "mongodb-memory-server";
import userService from "../../src/services/user.service";
import User from "../../src/models/user.model";
import { initializeTestDB, closeTestDB } from "../testSetup";

/**
 * Integration tests for the user service.
 * Ensures that user creation works correctly and that passwords are encrypted.
 */
jest.setTimeout(30000);
describe("User Service", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Initialize the in-memory database using the helper.
    const setup = await initializeTestDB();
    mongoServer = setup.mongoServer;
  });

  afterAll(async () => {
    // Clean up and stop the in-memory database.
    await closeTestDB(mongoServer);
  });

  beforeEach(async () => {
    // Remove all User documents to ensure an isolated test environment.
    await User.deleteMany({});
  });

  it("should create a new user with valid data", async () => {
    const userData = {
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "securepassword",
    };

    // Create the user using the user service.
    const newUser = await userService.createUser(userData);

    // Verify that the user was created successfully.
    expect(newUser).toBeDefined();
    expect(newUser._id).toBeDefined();
    expect(newUser.name).toBe(userData.name);
    expect(newUser.email).toBe(userData.email);

    // Ensure that the stored password is encrypted and not equal to the plain text.
    expect(newUser.password).not.toBe(userData.password);

    // Confirm that the original password matches the encrypted version.
    const isMatch = await bcrypt.compare(userData.password, newUser.password);
    expect(isMatch).toBe(true);
  });
});
