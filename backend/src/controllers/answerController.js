import Answer from "../models/Answer.js";
import Business from "../models/Business.js";
import Question from "../models/Question.js";

const GRADE_POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };

async function ownedQuestion(questionId, userId) {
  const question = await Question.findById(questionId).populate("business");
  if (!question || String(question.business.user) !== String(userId)) return null;
  return question;
}

export async function upsertAnswer(req, res, next) {
  try {
    const { questionId, text } = req.body;
    if (!questionId || !text || !text.trim()) {
      return res.status(400).json({ error: "questionId and text are required" });
    }

    const question = await ownedQuestion(questionId, req.user._id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const answer = await Answer.findOneAndUpdate(
      { question: question._id },
      { question: question._id, business: question.business._id, text: text.trim() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ answer });
  } catch (err) {
    next(err);
  }
}

export async function gradeAnswer(req, res, next) {
  try {
    const { grade } = req.body;
    if (!["A", "B", "C", "D", "F"].includes(grade)) {
      return res.status(400).json({ error: "Grade must be one of A, B, C, D, F" });
    }

    const answer = await Answer.findById(req.params.id).populate("business");
    if (!answer || String(answer.business.user) !== String(req.user._id)) {
      return res.status(404).json({ error: "Answer not found" });
    }

    answer.grade = grade;
    await answer.save();
    res.json({ answer });
  } catch (err) {
    next(err);
  }
}

export async function rankAnswer(req, res, next) {
  try {
    const { rank } = req.body;
    if (typeof rank !== "number" || rank < 1) {
      return res.status(400).json({ error: "rank must be a positive number" });
    }

    const answer = await Answer.findById(req.params.id).populate("business");
    if (!answer || String(answer.business.user) !== String(req.user._id)) {
      return res.status(404).json({ error: "Answer not found" });
    }

    answer.rank = rank;
    await answer.save();
    res.json({ answer });
  } catch (err) {
    next(err);
  }
}

export async function listAnswers(req, res, next) {
  try {
    const { businessId } = req.query;
    const business = await Business.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Business not found" });

    const answers = await Answer.find({ business: business._id })
      .populate("question")
      .sort({ rank: 1, createdAt: 1 });

    const graded = answers.filter((a) => a.grade);
    const average =
      graded.length > 0
        ? graded.reduce((sum, a) => sum + GRADE_POINTS[a.grade], 0) / graded.length
        : null;

    res.json({ answers, average });
  } catch (err) {
    next(err);
  }
}
