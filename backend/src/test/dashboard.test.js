import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { createTitle, registerUser } from "./helpers.js";

describe("GET /api/dashboard", () => {
  it("returns the user's titles and counts", async () => {
    const { token } = await registerUser();
    await createTitle(token, { title: "First" });
    await createTitle(token, { title: "Second" });

    const res = await request(app).get("/api/dashboard").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.titleCount).toBe(2);
    expect(res.body.answeredCount).toBe(0);
    expect(res.body.user.email).toBeTruthy();
  });

  it("requires authentication", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.status).toBe(401);
  });
});
