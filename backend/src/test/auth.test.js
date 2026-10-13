import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { registerUser } from "./helpers.js";

vi.mock("../utils/email.js", () => ({
  sendWelcomeEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

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

function extractToken(resetUrl) {
  return new URL(resetUrl).searchParams.get("token");
}

describe("POST /api/auth/forgot-password", () => {
  it("sends a reset email for a known account and returns a generic message", async () => {
    const { payload } = await registerUser();
    const res = await request(app).post("/api/auth/forgot-password").send({ email: payload.email });
    expect(res.status).toBe(200);
    expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail.mock.calls[0][0]).toBe(payload.email.toLowerCase());
  });

  it("returns the same generic message for an unknown email (no account enumeration)", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({ email: "nobody@example.com" });
    expect(res.status).toBe(200);
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("rejects a missing email", async () => {
    const res = await request(app).post("/api/auth/forgot-password").send({});
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/reset-password", () => {
  it("resets the password with a valid token and allows login with the new password", async () => {
    const { payload } = await registerUser();
    await request(app).post("/api/auth/forgot-password").send({ email: payload.email });
    const resetUrl = sendPasswordResetEmail.mock.calls.at(-1)[2];
    const token = extractToken(resetUrl);

    const resetRes = await request(app)
      .post("/api/auth/reset-password")
      .send({ email: payload.email, token, password: "newpassword123" });
    expect(resetRes.status).toBe(200);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: payload.email, password: "newpassword123" });
    expect(loginRes.status).toBe(200);

    const oldLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: payload.email, password: payload.password });
    expect(oldLoginRes.status).toBe(401);
  });

  it("rejects an invalid token", async () => {
    const { payload } = await registerUser();
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ email: payload.email, token: "not-the-real-token", password: "newpassword123" });
    expect(res.status).toBe(400);
  });

  it("rejects a reused/expired token", async () => {
    const { payload } = await registerUser();
    await request(app).post("/api/auth/forgot-password").send({ email: payload.email });
    const resetUrl = sendPasswordResetEmail.mock.calls.at(-1)[2];
    const token = extractToken(resetUrl);

    await request(app)
      .post("/api/auth/reset-password")
      .send({ email: payload.email, token, password: "newpassword123" });

    const secondAttempt = await request(app)
      .post("/api/auth/reset-password")
      .send({ email: payload.email, token, password: "anotherpassword123" });
    expect(secondAttempt.status).toBe(400);
  });

  it("rejects a short new password", async () => {
    const { payload } = await registerUser();
    await request(app).post("/api/auth/forgot-password").send({ email: payload.email });
    const resetUrl = sendPasswordResetEmail.mock.calls.at(-1)[2];
    const token = extractToken(resetUrl);

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ email: payload.email, token, password: "short" });
    expect(res.status).toBe(400);
  });
});
