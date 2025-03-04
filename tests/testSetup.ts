// tests/testSetup.ts

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDB from "../src/config/database";
import { signToken } from "../src/utils/jwt.util";

/**
 * Initializes an in-memory MongoDB instance for integration testing.
 * Sets the environment variable MONGO_URI and connects to the DB.
 * Returns the MongoMemoryServer instance along with a dummy user ID and a valid JWT token.
 */
export async function initializeTestDB() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  await connectDB();

  // Create a dummy user ID and generate a valid JWT for testing purposes.
  const dummyUserId = new mongoose.Types.ObjectId().toString();
  const validToken = signToken({ id: dummyUserId, role: "user" });

  return { mongoServer, dummyUserId, validToken };
}

/**
 * Cleans up the in-memory database by dropping the database, closing the connection,
 * and stopping the MongoMemoryServer.
 * @param mongoServer - The MongoMemoryServer instance to be stopped.
 */
export async function closeTestDB(mongoServer: MongoMemoryServer) {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}
