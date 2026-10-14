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

describe("POST /api/grades", () => {
  it("grades an answer and refreshes the average", async () => {
    const { token, businessId, answer } = await setup();
    const res = await request(app)
      .post("/api/grades")
      .set("Authorization", `Bearer ${token}`)
      .send({ answerId: answer._id, grade: "B" });
    expect(res.status).toBe(200);
    expect(res.body.grade.grade).toBe("B");
    expect(res.body.average.averageGrade).toBe(3);

    const list = await request(app)
      .get(`/api/grades?businessId=${businessId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(list.body.answers).toHaveLength(1);
    expect(list.body.answers[0].grade).toBe("B");
  });

  it("rejects an invalid grade", async () => {
    const { token, answer } = await setup();
    const res = await request(app)
      .post("/api/grades")
      .set("Authorization", `Bearer ${token}`)
      .send({ answerId: answer._id, grade: "Z" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for someone else's answer", async () => {
    const { answer } = await setup();
    const { token: otherToken } = await registerUser();
    const res = await request(app)
      .post("/api/grades")
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ answerId: answer._id, grade: "A" });
    expect(res.status).toBe(404);
  });

  it("updates an existing grade rather than duplicating it", async () => {
    const { token, answer } = await setup();
    await request(app)
      .post("/api/grades")
      .set("Authorization", `Bearer ${token}`)
      .send({ answerId: answer._id, grade: "C" });
    const res = await request(app)
      .post("/api/grades")
      .set("Authorization", `Bearer ${token}`)
      .send({ answerId: answer._id, grade: "A" });
    expect(res.body.grade.grade).toBe("A");
    expect(res.body.average.gradedCount).toBe(1);
  });
});
