import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { registerUser } from "./helpers.js";

describe("POST /api/billing/upgrade", () => {
  it("upgrades a user to member", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/billing/upgrade")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "member" });
    expect(res.status).toBe(200);
    expect(res.body.user.plan).toBe("member");
    expect(res.body.user.questionsQuota).toBe(50);
    expect(res.body.user.questionsUsed).toBe(0);
  });

  it("upgrades a user to pro", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/billing/upgrade")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "pro" });
    expect(res.status).toBe(200);
    expect(res.body.user.plan).toBe("pro");
    expect(res.body.user.questionsQuota).toBe(75);
  });

  it("adds bonus questions on top of the current quota", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/billing/upgrade")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "bonus" });
    expect(res.status).toBe(200);
    expect(res.body.user.questionsQuota).toBe(5 + 100);
  });

  it("rejects an unknown plan", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/billing/upgrade")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "ultra" });
    expect(res.status).toBe(400);
  });

  it("requires authentication", async () => {
    const res = await request(app).post("/api/billing/upgrade").send({ plan: "member" });
    expect(res.status).toBe(401);
  });
});
