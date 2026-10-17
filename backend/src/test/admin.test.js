import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app.js";
import User from "../models/User.js";
import { sendBroadcastEmail } from "../utils/email.js";
import { createTitle, registerUser } from "./helpers.js";

vi.mock("../utils/email.js", () => ({
  sendWelcomeEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendBroadcastEmail: vi.fn(),
}));

async function makeAdmin(userId) {
  await User.findByIdAndUpdate(userId, { role: "admin" });
}

describe("Admin routes", () => {
  it("blocks a non-admin user with 403", async () => {
    const { token } = await registerUser();
    const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("blocks an unauthenticated request with 401", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(401);
  });

  it("lets an admin list all users", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);
    await registerUser();
    await registerUser();

    const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${admin.token}`);
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBeGreaterThanOrEqual(3);
    expect(res.body.users[0].passwordHash).toBeUndefined();
  });

  it("lets an admin promote another user to admin", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);
    const other = await registerUser();

    const res = await request(app)
      .patch(`/api/admin/users/${other.user._id}/role`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ role: "admin" });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("admin");
  });

  it("rejects an invalid role value", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);
    const other = await registerUser();

    const res = await request(app)
      .patch(`/api/admin/users/${other.user._id}/role`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ role: "superuser" });
    expect(res.status).toBe(400);
  });

  it("prevents an admin from removing their own admin access", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);

    const res = await request(app)
      .patch(`/api/admin/users/${admin.user._id}/role`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ role: "user" });
    expect(res.status).toBe(400);
  });

  it("returns platform stats for an admin", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);
    await createTitle(admin.token);

    const res = await request(app).get("/api/admin/stats").set("Authorization", `Bearer ${admin.token}`);
    expect(res.status).toBe(200);
    expect(res.body.userCount).toBeGreaterThanOrEqual(1);
    expect(res.body.businessCount).toBeGreaterThanOrEqual(1);
  });

  it("registers new users with role 'user' by default", async () => {
    const { user } = await registerUser();
    expect(user.role).toBe("user");
  });
});

describe("POST /api/admin/broadcast", () => {
  it("blocks a non-admin user", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/admin/broadcast")
      .set("Authorization", `Bearer ${token}`)
      .send({ subject: "Hi", message: "Hello" });
    expect(res.status).toBe(403);
  });

  it("rejects a missing subject or message", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);

    const res = await request(app)
      .post("/api/admin/broadcast")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ subject: "", message: "Hello" });
    expect(res.status).toBe(400);
  });

  it("sends to every opted-in user and skips opted-out users", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);
    await registerUser();
    const optedOut = await registerUser();
    await User.updateOne({ _id: optedOut.user._id }, { emailOptIn: false });
    sendBroadcastEmail.mockResolvedValue();

    const res = await request(app)
      .post("/api/admin/broadcast")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ subject: "Big news", message: "We shipped a new feature" });
    expect(res.status).toBe(200);
    expect(res.body.recipientCount).toBe(2);
    expect(res.body.sent).toBe(2);
    expect(res.body.failed).toBe(0);
    expect(sendBroadcastEmail).toHaveBeenCalledTimes(2);
    expect(sendBroadcastEmail).not.toHaveBeenCalledWith(optedOut.user.email, expect.anything(), expect.anything(), expect.anything());
  });

  it("counts failures without failing the whole request", async () => {
    const admin = await registerUser();
    await makeAdmin(admin.user._id);
    await registerUser();
    sendBroadcastEmail.mockRejectedValue(new Error("send failed"));

    const res = await request(app)
      .post("/api/admin/broadcast")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ subject: "Big news", message: "We shipped a new feature" });
    expect(res.status).toBe(200);
    expect(res.body.failed).toBeGreaterThanOrEqual(1);
    expect(res.body.sent).toBe(0);
  });
});
