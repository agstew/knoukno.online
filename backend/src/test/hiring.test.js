import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app.js";
import { sendHiringEmail } from "../utils/email.js";

vi.mock("../utils/email.js", () => ({
  sendHiringEmail: vi.fn(),
}));

describe("POST /api/hiring", () => {
  it("rejects a missing field", async () => {
    const res = await request(app).post("/api/hiring").send({ name: "Jordan", email: "jordan@example.com" });
    expect(res.status).toBe(400);
    expect(sendHiringEmail).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const res = await request(app)
      .post("/api/hiring")
      .send({ name: "Jordan", email: "not-an-email", message: "I'd like to apply." });
    expect(res.status).toBe(400);
  });

  it("sends the hiring email and returns a confirmation message", async () => {
    const res = await request(app)
      .post("/api/hiring")
      .send({ name: "Jordan", email: "jordan@example.com", role: "Engineer", message: "I'd like to apply." });
    expect(res.status).toBe(200);
    expect(res.body.message).toBeTruthy();
    expect(sendHiringEmail).toHaveBeenCalledWith("Jordan", "jordan@example.com", "Engineer", "I'd like to apply.");
  });
});
