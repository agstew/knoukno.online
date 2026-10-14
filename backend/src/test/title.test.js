import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { createTitle, registerUser } from "./helpers.js";

describe("POST /api/titles", () => {
  it("creates a title for the authenticated user", async () => {
    const { token } = await registerUser();
    const res = await createTitle(token, { title: "Corner Cafe" });
    expect(res.status).toBe(201);
    expect(res.body.title.title).toBe("Corner Cafe");
  });

  it("rejects a missing title", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/titles")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "   " });
    expect(res.status).toBe(400);
  });

  it("requires authentication", async () => {
    const res = await request(app).post("/api/titles").send({ title: "No Auth" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/titles", () => {
  it("lists only the caller's titles, newest first", async () => {
    const { token } = await registerUser();
    await createTitle(token, { title: "First" });
    await createTitle(token, { title: "Second" });

    const res = await request(app).get("/api/titles").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.titles).toHaveLength(2);
    expect(res.body.titles[0].title).toBe("Second");
  });

  it("does not leak another user's titles", async () => {
    const owner = await registerUser();
    await createTitle(owner.token, { title: "Owner Biz" });

    const other = await registerUser();
    const res = await request(app).get("/api/titles").set("Authorization", `Bearer ${other.token}`);
    expect(res.status).toBe(200);
    expect(res.body.titles).toHaveLength(0);
  });
});

describe("GET /api/titles/:id", () => {
  it("returns a title owned by the caller", async () => {
    const { token } = await registerUser();
    const created = await createTitle(token, { title: "Mine" });

    const res = await request(app)
      .get(`/api/titles/${created.body.title._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title.title).toBe("Mine");
  });

  it("returns 404 for a title owned by someone else", async () => {
    const owner = await registerUser();
    const created = await createTitle(owner.token, { title: "Owner Biz" });

    const other = await registerUser();
    const res = await request(app)
      .get(`/api/titles/${created.body.title._id}`)
      .set("Authorization", `Bearer ${other.token}`);
    expect(res.status).toBe(404);
  });

  it("returns 404 for a non-existent id", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .get("/api/titles/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/titles/:id", () => {
  it("requires authentication", async () => {
    const { token } = await registerUser();
    const created = await createTitle(token, { title: "Mine" });
    const res = await request(app).delete(`/api/titles/${created.body.title._id}`);
    expect(res.status).toBe(401);
  });

  it("returns 404 for a title owned by someone else", async () => {
    const owner = await registerUser();
    const created = await createTitle(owner.token, { title: "Owner Biz" });

    const other = await registerUser();
    const res = await request(app)
      .delete(`/api/titles/${created.body.title._id}`)
      .set("Authorization", `Bearer ${other.token}`);
    expect(res.status).toBe(404);
  });

  it("deletes the title, cascades its questions, and syncs questionsUsed", async () => {
    const { token, user } = await registerUser();
    const created = await createTitle(token, { title: "Doomed Biz" });
    const businessId = created.body.title._id;

    await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId, stage: "law" });

    const res = await request(app)
      .delete(`/api/titles/${businessId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);

    const getRes = await request(app)
      .get(`/api/titles/${businessId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.status).toBe(404);

    const remainingQuestions = await Question.find({ business: businessId });
    expect(remainingQuestions).toHaveLength(0);

    const updated = await User.findById(user._id);
    expect(updated.questionsUsed).toBe(0);
  });
});
