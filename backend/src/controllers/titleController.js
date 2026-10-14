import Title from "../models/Title.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import Grade from "../models/Grade.js";
import Rate from "../models/Rate.js";
import Average from "../models/Average.js";
import User from "../models/User.js";

export async function listTitles(req, res, next) {
  try {
    const titles = await Title.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ titles });
  } catch (err) {
    next(err);
  }
}

export async function createTitle(req, res, next) {
  try {
    const { title, industry, location, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Business title is required" });
    }
    const created = await Title.create({
      user: req.user._id,
      title: title.trim(),
      industry: (industry || "").trim(),
      location: (location || "").trim(),
      description: (description || "").trim(),
    });
    res.status(201).json({ title: created });
  } catch (err) {
    next(err);
  }
}

export async function getTitle(req, res, next) {
  try {
    const title = await Title.findOne({ _id: req.params.id, user: req.user._id });
    if (!title) return res.status(404).json({ error: "Title not found" });
    res.json({ title });
  } catch (err) {
    next(err);
  }
}

export async function deleteTitle(req, res, next) {
  try {
    const title = await Title.findOne({ _id: req.params.id, user: req.user._id });
    if (!title) return res.status(404).json({ error: "Title not found" });

    const questionIds = await Question.find({ business: title._id }).distinct("_id");
    const questionCount = questionIds.length;

    await Answer.deleteMany({ business: title._id });
    await Grade.deleteMany({ business: title._id });
    await Rate.deleteMany({ business: title._id });
    await Average.deleteMany({ business: title._id });
    await Question.deleteMany({ business: title._id });
    await title.deleteOne();

    if (questionCount > 0) {
      await User.updateOne(
        { _id: req.user._id },
        [{ $set: { questionsUsed: { $max: [0, { $subtract: ["$questionsUsed", questionCount] }] } } }]
      );
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
