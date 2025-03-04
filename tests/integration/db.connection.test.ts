//! tests/integration/db.connection.test.ts

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initializeTestDB, closeTestDB } from "../testSetup";

jest.setTimeout(30000);
describe("Database Connection", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Initializes the in-memory DB and connects using the centralized configuration.
    const setup = await initializeTestDB();
    mongoServer = setup.mongoServer;
  });

  afterAll(async () => {
    // Cleans up the DB and stops the in-memory server.
    await closeTestDB(mongoServer);
  });

  it("should connect to the in-memory database", () => {
    // readyState === 1 indicates that the connection is active.
    expect(mongoose.connection.readyState).toBe(1);
  });
});
