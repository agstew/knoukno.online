import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app.js";
import { sendContactEmail } from "../utils/email.js";

vi.mock("../utils/email.js", () => ({
  sendContactEmail: vi.fn(),
}));

describe("POST /api/contact", () => {
  it("rejects a missing field", async () => {
    const res = await request(app).post("/api/contact").send({ name: "Jordan", email: "jordan@example.com" });
    expect(res.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({ name: "Jordan", email: "not-an-email", message: "Hi there" });
    expect(res.status).toBe(400);
  });

  it("sends the contact email and returns a confirmation message", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({ name: "Jordan", email: "jordan@example.com", message: "Hi, I have a question." });
    expect(res.status).toBe(200);
    expect(res.body.message).toBeTruthy();
    expect(sendContactEmail).toHaveBeenCalledWith("Jordan", "jordan@example.com", "Hi, I have a question.");
  });
});
