import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import User from "../models/User.js";
import { createTitle, registerUser } from "./helpers.js";

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
