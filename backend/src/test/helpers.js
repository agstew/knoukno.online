import request from "supertest";
import app from "../app.js";

// Registers a unique user and returns {res, payload, token, user}
export async function registerUser(overrides = {}) {
  const payload = {
    name: "Test User",
    email: `user_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    password: "password123",
    ...overrides,
  };
  const res = await request(app).post("/api/auth/register").send(payload);
  return { res, payload, token: res.body.token, user: res.body.user };
}

export async function createBusiness(token, overrides = {}) {
  const payload = { title: "Test Biz", industry: "Retail", location: "NYC", ...overrides };
  const res = await request(app).post("/api/businesses").set("Authorization", `Bearer ${token}`).send(payload);
  return res;
}
