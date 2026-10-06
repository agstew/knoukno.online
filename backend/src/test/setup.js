import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll } from "vitest";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret";

let mongod;

beforeAll(async () => {
  // Pinned to 6.0 - newer binaries are built for a macOS SDK newer than this host's libc++
  mongod = await MongoMemoryServer.create({ binary: { version: "6.0.14" } });
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
