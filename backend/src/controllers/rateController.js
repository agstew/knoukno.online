import Answer from "../models/Answer.js";
import Rate from "../models/Rate.js";
import Title from "../models/Title.js";
import { refreshAverage } from "../utils/averages.js";

export async function listRates(req, res, next) {
  try {
    const { businessId } = req.query;
    const business = await Title.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Title not found" });

    const answers = await Answer.find({ business: business._id }).populate("question");
    const rates = await Rate.find({ business: business._id, user: req.user._id });
    const rateByAnswer = new Map(rates.map((r) => [r.answer.toString(), r]));

    res.json({
      answers: answers.map((a) => ({
        answer: a,
        rate: rateByAnswer.get(a._id.toString())?.rate || null,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function upsertRate(req, res, next) {
  try {
    const { answerId, rate } = req.body;
    if (typeof rate !== "number" || rate < 1) {
      return res.status(400).json({ error: "rate must be a positive number" });
    }

    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    const business = await Title.findOne({ _id: answer.business, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Answer not found" });

    const saved = await Rate.findOneAndUpdate(
      { answer: answer._id },
      { answer: answer._id, business: business._id, user: req.user._id, rate },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const average = await refreshAverage(req.user._id, business._id);
    res.json({ rate: saved, average });
  } catch (err) {
    next(err);
  }
}
