import Answer from "../models/Answer.js";
import Grade from "../models/Grade.js";
import Title from "../models/Title.js";
import { refreshAverage } from "../utils/averages.js";

export async function listGrades(req, res, next) {
  try {
    const { businessId } = req.query;
    const business = await Title.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Title not found" });

    const answers = await Answer.find({ business: business._id }).populate("question");
    const grades = await Grade.find({ business: business._id, user: req.user._id });
    const gradeByAnswer = new Map(grades.map((g) => [g.answer.toString(), g]));

    res.json({
      answers: answers.map((a) => ({
        answer: a,
        grade: gradeByAnswer.get(a._id.toString())?.grade || null,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function upsertGrade(req, res, next) {
  try {
    const { answerId, grade } = req.body;
    if (!["A", "B", "C", "D", "F"].includes(grade)) {
      return res.status(400).json({ error: "Grade must be one of A, B, C, D, F" });
    }

    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    const business = await Title.findOne({ _id: answer.business, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Answer not found" });

    const saved = await Grade.findOneAndUpdate(
      { answer: answer._id },
      { answer: answer._id, business: business._id, user: req.user._id, grade },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const average = await refreshAverage(req.user._id, business._id);
    res.json({ grade: saved, average });
  } catch (err) {
    next(err);
  }
}
