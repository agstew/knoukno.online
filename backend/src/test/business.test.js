import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { createBusiness, registerUser } from "./helpers.js";

describe("POST /api/businesses", () => {
  it("creates a business for the authenticated user", async () => {
    const { token } = await registerUser();
    const res = await createBusiness(token, { title: "Corner Cafe" });
    expect(res.status).toBe(201);
    expect(res.body.business.title).toBe("Corner Cafe");
  });

  it("rejects a missing title", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/businesses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "   " });
    expect(res.status).toBe(400);
  });

  it("requires authentication", async () => {
    const res = await request(app).post("/api/businesses").send({ title: "No Auth" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/businesses", () => {
  it("lists only the caller's businesses, newest first", async () => {
    const { token } = await registerUser();
    await createBusiness(token, { title: "First" });
    await createBusiness(token, { title: "Second" });

    const res = await request(app).get("/api/businesses").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.businesses).toHaveLength(2);
    expect(res.body.businesses[0].title).toBe("Second");
  });

  it("does not leak another user's businesses", async () => {
    const owner = await registerUser();
    await createBusiness(owner.token, { title: "Owner Biz" });

    const other = await registerUser();
    const res = await request(app).get("/api/businesses").set("Authorization", `Bearer ${other.token}`);
    expect(res.status).toBe(200);
    expect(res.body.businesses).toHaveLength(0);
  });
});

describe("GET /api/businesses/:id", () => {
  it("returns a business owned by the caller", async () => {
    const { token } = await registerUser();
    const created = await createBusiness(token, { title: "Mine" });

    const res = await request(app)
      .get(`/api/businesses/${created.body.business._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.business.title).toBe("Mine");
  });

  it("returns 404 for a business owned by someone else", async () => {
    const owner = await registerUser();
    const created = await createBusiness(owner.token, { title: "Owner Biz" });

    const other = await registerUser();
    const res = await request(app)
      .get(`/api/businesses/${created.body.business._id}`)
      .set("Authorization", `Bearer ${other.token}`);
    expect(res.status).toBe(404);
  });

  it("returns 404 for a non-existent id", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .get("/api/businesses/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
