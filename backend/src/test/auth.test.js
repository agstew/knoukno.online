import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { registerUser } from "./helpers.js";

describe("POST /api/auth/register", () => {
  it("creates a new user and returns a token", async () => {
    const { res, payload } = await registerUser();
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(payload.email.toLowerCase());
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.plan).toBe("free");
    expect(res.body.user.questionsQuota).toBe(5);
  });

  it("rejects missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "a@b.com" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "X", email: "not-an-email", password: "password123" });
    expect(res.status).toBe(400);
  });

  it("rejects short passwords", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "X", email: "short@example.com", password: "short" });
    expect(res.status).toBe(400);
  });

  it("rejects duplicate email", async () => {
    const { payload } = await registerUser();
    const res = await request(app).post("/api/auth/register").send(payload);
    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials", async () => {
    const { payload } = await registerUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: payload.email, password: payload.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it("rejects wrong password", async () => {
    const { payload } = await registerUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: payload.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("rejects unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the authenticated user", async () => {
    const { token, user } = await registerUser();
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
  });

  it("rejects when no token is provided", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("rejects an invalid token", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer garbage.token.here");
    expect(res.status).toBe(401);
  });
});
