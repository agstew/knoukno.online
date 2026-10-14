import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
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
