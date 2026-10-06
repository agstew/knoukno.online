import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { createBusiness, registerUser } from "./helpers.js";

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
    const business = await createBusiness(token);
    const question = await createQuestion(token, business.body.business._id);

    const res = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "We are forming an LLC." });
    expect(res.status).toBe(200);
    expect(res.body.answer.text).toBe("We are forming an LLC.");
  });

  it("upserts (updates) an existing answer for the same question", async () => {
    const { token } = await registerUser();
    const business = await createBusiness(token);
    const question = await createQuestion(token, business.body.business._id);

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
      .get(`/api/answers?businessId=${business.body.business._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(list.body.answers).toHaveLength(1);
  });

  it("returns 404 for a question owned by someone else", async () => {
    const owner = await registerUser();
    const business = await createBusiness(owner.token);
    const question = await createQuestion(owner.token, business.body.business._id);

    const other = await registerUser();
    const res = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${other.token}`)
      .send({ questionId: question._id, text: "Sneaky answer" });
    expect(res.status).toBe(404);
  });

  it("rejects an empty answer", async () => {
    const { token } = await registerUser();
    const business = await createBusiness(token);
    const question = await createQuestion(token, business.body.business._id);

    const res = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "   " });
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/answers/:id/grade and /rank", () => {
  async function setup() {
    const { token } = await registerUser();
    const business = await createBusiness(token);
    const question = await createQuestion(token, business.body.business._id);
    const answerRes = await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "An answer" });
    return { token, business, answer: answerRes.body.answer };
  }

  it("grades an answer", async () => {
    const { token, answer } = await setup();
    const res = await request(app)
      .patch(`/api/answers/${answer._id}/grade`)
      .set("Authorization", `Bearer ${token}`)
      .send({ grade: "B" });
    expect(res.status).toBe(200);
    expect(res.body.answer.grade).toBe("B");
  });

  it("rejects an invalid grade", async () => {
    const { token, answer } = await setup();
    const res = await request(app)
      .patch(`/api/answers/${answer._id}/grade`)
      .set("Authorization", `Bearer ${token}`)
      .send({ grade: "Z" });
    expect(res.status).toBe(400);
  });

  it("ranks an answer", async () => {
    const { token, answer } = await setup();
    const res = await request(app)
      .patch(`/api/answers/${answer._id}/rank`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rank: 1 });
    expect(res.status).toBe(200);
    expect(res.body.answer.rank).toBe(1);
  });

  it("rejects a non-positive rank", async () => {
    const { token, answer } = await setup();
    const res = await request(app)
      .patch(`/api/answers/${answer._id}/rank`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rank: 0 });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/answers average", () => {
  it("computes the average of graded answers only", async () => {
    const { token } = await registerUser();
    const business = await createBusiness(token);

    const q1 = await createQuestion(token, business.body.business._id, "law");
    const q2 = await createQuestion(token, business.body.business._id, "location");

    const a1 = (
      await request(app)
        .post("/api/answers")
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: q1._id, text: "Answer one" })
    ).body.answer;
    const a2 = (
      await request(app)
        .post("/api/answers")
        .set("Authorization", `Bearer ${token}`)
        .send({ questionId: q2._id, text: "Answer two" })
    ).body.answer;

    // Only grade one answer - average should be based on graded answers only (B = 3)
    await request(app).patch(`/api/answers/${a1._id}/grade`).set("Authorization", `Bearer ${token}`).send({ grade: "B" });

    const res = await request(app)
      .get(`/api/answers?businessId=${business.body.business._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.answers).toHaveLength(2);
    expect(res.body.average).toBe(3);

    await request(app).patch(`/api/answers/${a2._id}/grade`).set("Authorization", `Bearer ${token}`).send({ grade: "F" });
    const res2 = await request(app)
      .get(`/api/answers?businessId=${business.body.business._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res2.body.average).toBe(1.5);
  });

  it("returns null average when nothing is graded yet", async () => {
    const { token } = await registerUser();
    const business = await createBusiness(token);
    const q1 = await createQuestion(token, business.body.business._id);
    await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: q1._id, text: "Ungraded" });

    const res = await request(app)
      .get(`/api/answers?businessId=${business.body.business._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.average).toBeNull();
  });
});
