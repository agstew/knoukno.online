import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { createTitle, registerUser } from "./helpers.js";

async function setup() {
  const { token } = await registerUser();
  const title = await createTitle(token);
  const businessId = title.body.title._id;
  return { token, businessId };
}

async function answerFor(token, businessId, stage) {
  const question = (
    await request(app)
      .post("/api/questions/next")
      .set("Authorization", `Bearer ${token}`)
      .send({ businessId, stage })
  ).body.question;
  return (
    await request(app)
      .post("/api/answers")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question._id, text: `Answer for ${stage}` })
  ).body.answer;
}

describe("GET /api/averages", () => {
  it("returns null averages when nothing is graded or rated yet", async () => {
    const { token, businessId } = await setup();
    const res = await request(app)
      .get(`/api/averages?businessId=${businessId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.average.averageGrade).toBeNull();
    expect(res.body.average.averageRate).toBeNull();
  });

  it("computes the average across graded answers only", async () => {
    const { token, businessId } = await setup();
    const a1 = await answerFor(token, businessId, "law");
    const a2 = await answerFor(token, businessId, "location");

    await request(app).post("/api/grades").set("Authorization", `Bearer ${token}`).send({ answerId: a1._id, grade: "B" });
    await request(app).post("/api/grades").set("Authorization", `Bearer ${token}`).send({ answerId: a2._id, grade: "F" });

    const res = await request(app)
      .get(`/api/averages?businessId=${businessId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.average.averageGrade).toBe(1.5);
    expect(res.body.average.gradedCount).toBe(2);
  });

  it("returns 404 for a business owned by someone else", async () => {
    const owner = await setup();
    const { token: otherToken } = await registerUser();
    const res = await request(app)
      .get(`/api/averages?businessId=${owner.businessId}`)
      .set("Authorization", `Bearer ${otherToken}`);
    expect(res.status).toBe(404);
  });
});
