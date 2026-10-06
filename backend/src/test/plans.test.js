import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("GET /api/plans", () => {
  it("returns all plan definitions without auth", async () => {
    const res = await request(app).get("/api/plans");
    expect(res.status).toBe(200);
    expect(res.body.plans).toHaveLength(4);
    const keys = res.body.plans.map((p) => p.key).sort();
    expect(keys).toEqual(["bonus", "free", "member", "pro"]);
  });
});
