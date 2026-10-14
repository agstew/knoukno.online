import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import User from "../models/User.js";
import { createTitle, registerUser } from "./helpers.js";

describe("POST /api/questions/next", () => {
  it("generates the next question and increments questionsUsed", async () => {
    const { token } = await registerUser();
    const title = await createTitle(token);
    const businessId = title.body.title._id;

    const res = await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId, stage: "law" });

    expect(res.status).toBe(201);
    expect(res.body.question.stage).toBe("law");
    expect(res.body.question.text).toContain(title.body.title.title);
    expect(res.body.user.questionsUsed).toBe(1);
  });

  it("rejects an invalid stage", async () => {
    const { token } = await registerUser();
    const title = await createTitle(token);

    const res = await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId: title.body.title._id, stage: "not-a-stage" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for a business the user doesn't own", async () => {
    const owner = await registerUser();
    const title = await createTitle(owner.token);

    const other = await registerUser();
    const res = await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${other.token}`)
      .send({ businessId: title.body.title._id, stage: "law" });
    expect(res.status).toBe(404);
  });

  it("blocks further questions once the free trial has ended", async () => {
    const { token, user } = await registerUser();
    const title = await createTitle(token);
    await User.findByIdAndUpdate(user._id, { trialEndsAt: new Date(Date.now() - 1000) });

    const res = await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId: title.body.title._id, stage: "law" });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/trial has ended/i);
  });

  it("blocks further questions once the quota is used up", async () => {
    const { token, user } = await registerUser();
    const title = await createTitle(token);
    await User.findByIdAndUpdate(user._id, { questionsUsed: user.questionsQuota });

    const res = await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId: title.body.title._id, stage: "law" });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/used all questions/i);
  });
});

describe("GET /api/questions", () => {
  it("lists questions for a business, optionally filtered by stage", async () => {
    const { token } = await registerUser();
    const title = await createTitle(token);
    const businessId = title.body.title._id;

    await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId, stage: "law" });
    await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId, stage: "location" });

    const all = await request(app).get(`/api/questions?businessId=${businessId}`).set("Authorization", `Bearer ${token}`);
    expect(all.body.questions).toHaveLength(2);

    const lawOnly = await request(app)
      .get(`/api/questions?businessId=${businessId}&stage=law`)
      .set("Authorization", `Bearer ${token}`);
    expect(lawOnly.body.questions).toHaveLength(1);
    expect(lawOnly.body.questions[0].stage).toBe("law");
  });
});
