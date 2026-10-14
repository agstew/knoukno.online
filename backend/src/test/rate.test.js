import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { createTitle, registerUser } from "./helpers.js";

async function setup() {
  const { token } = await registerUser();
  const title = await createTitle(token);
  const businessId = title.body.title._id;
  const question = (
    await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId, stage: "law" })
  ).body.question;
  const answer = (
    await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: "An answer" })
  ).body.answer;
  return { token, businessId, answer };
}

describe("POST /api/rates", () => {
  it("rates an answer and refreshes the average", async () => {
    const { token, businessId, answer } = await setup();
    const res = await request(app)
      .post("/api/rates")
      .set("Authorization", `Bearer ${token}`)
      .send({ answerId: answer._id, rate: 4 });
    expect(res.status).toBe(200);
    expect(res.body.rate.rate).toBe(4);
    expect(res.body.average.averageRate).toBe(4);

    const list = await request(app)
      .get(`/api/rates?businessId=${businessId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(list.body.answers).toHaveLength(1);
    expect(list.body.answers[0].rate).toBe(4);
  });

  it("rejects a non-positive rate", async () => {
    const { token, answer } = await setup();
    const res = await request(app)
      .post("/api/rates")
      .set("Authorization", `Bearer ${token}`)
      .send({ answerId: answer._id, rate: 0 });
    expect(res.status).toBe(400);
  });

  it("returns 404 for someone else's answer", async () => {
    const { answer } = await setup();
    const { token: otherToken } = await registerUser();
    const res = await request(app)
      .post("/api/rates")
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ answerId: answer._id, rate: 2 });
    expect(res.status).toBe(404);
  });
});
