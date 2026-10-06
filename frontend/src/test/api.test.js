import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api.js";

function mockFetchOnce(body, ok = true, status = ok ? 200 : 400) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("api client", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a JSON POST with no auth header for register", async () => {
    mockFetchOnce({ token: "t", user: { email: "a@b.com" } });
    await api.register({ name: "A", email: "a@b.com", password: "password123" });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/register",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
        body: JSON.stringify({ name: "A", email: "a@b.com", password: "password123" }),
      })
    );
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("attaches a bearer token when provided", async () => {
    mockFetchOnce({ user: { email: "a@b.com" } });
    await api.me("abc123");

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/auth/me");
    expect(options.headers.Authorization).toBe("Bearer abc123");
    expect(options.body).toBeUndefined();
  });

  it("throws the server error message when the response is not ok", async () => {
    mockFetchOnce({ error: "Invalid email or password" }, false, 401);
    await expect(api.login({ email: "a@b.com", password: "bad" })).rejects.toThrow(
      "Invalid email or password"
    );
  });

  it("falls back to a generic error when the response has no body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("no body")),
    });
    await expect(api.login({ email: "a@b.com", password: "bad" })).rejects.toThrow("Request failed");
  });
});
