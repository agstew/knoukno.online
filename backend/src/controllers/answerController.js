import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Title from "../models/Title.js";

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

export async function listAnswers(req, res, next) {
  try {
    const { businessId } = req.query;
    const business = await Title.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Title not found" });

    const answers = await Answer.find({ business: business._id })
      .populate("question")
      .sort({ createdAt: 1 });

    res.json({ answers });
  } catch (err) {
    next(err);
  }
}
