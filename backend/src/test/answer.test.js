import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { createTitle, registerUser } from "./helpers.js";

async function createQuestion(token, businessId, stage = "law") {
  const res = await request(app)
    .post("/api/questions/next")
    .set("Authorization", `Bearer ${token}`)
    .send({ businessId, stage });
  return res.body.question;
}

describe("POST /api/answers", () => {
  it("creates an answer for an owned question", async () => {
    const { token } = await registerUser();
    const title = await createTitle(token);
    const question = await createQuestion(token, title.body.title._id);

    const res = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "We are forming an LLC." });
    expect(res.status).toBe(200);
    expect(res.body.answer.text).toBe("We are forming an LLC.");
  });

  it("upserts (updates) an existing answer for the same question", async () => {
    const { token } = await registerUser();
    const title = await createTitle(token);
    const question = await createQuestion(token, title.body.title._id);

    await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "First draft" });
    const res = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "Final answer" });

    expect(res.status).toBe(200);
    expect(res.body.answer.text).toBe("Final answer");

    const list = await request(app)
      .get(`/api/answers?businessId=${title.body.title._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(list.body.answers).toHaveLength(1);
  });

  it("returns 404 for a question owned by someone else", async () => {
    const owner = await registerUser();
    const title = await createTitle(owner.token);
    const question = await createQuestion(owner.token, title.body.title._id);

    const other = await registerUser();
    const res = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${other.token}`)
      .send({ questionId: question._id, text: "Sneaky answer" });
    expect(res.status).toBe(404);
  });

  it("rejects an empty answer", async () => {
    const { token } = await registerUser();
    const title = await createTitle(token);
    const question = await createQuestion(token, title.body.title._id);

    const res = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "   " });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/answers", () => {
  it("lists answers for a business owned by the caller", async () => {
    const { token } = await registerUser();
    const title = await createTitle(token);
    const question = await createQuestion(token, title.body.title._id);
    await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "An answer" });

    const res = await request(app)
      .get(`/api/answers?businessId=${title.body.title._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.answers).toHaveLength(1);
  });

  it("returns 404 for a business owned by someone else", async () => {
    const owner = await registerUser();
    const title = await createTitle(owner.token);

    const other = await registerUser();
    const res = await request(app)
      .get(`/api/answers?businessId=${title.body.title._id}`)
      .set("Authorization", `Bearer ${other.token}`);
    expect(res.status).toBe(404);
  });
});
