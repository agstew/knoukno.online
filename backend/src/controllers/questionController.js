import Business from "../models/Business.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { generateQuestions, STAGE_LIST } from "../utils/questionBank.js";

async function ownedBusiness(businessId, userId) {
  return Business.findOne({ _id: businessId, user: userId });
}

export async function listQuestions(req, res, next) {
  try {
    const { businessId, stage } = req.query;
    const business = await ownedBusiness(businessId, req.user._id);
    if (!business) return res.status(404).json({ error: "Business not found" });

    const filter = { business: business._id };
    if (stage) filter.stage = stage;

    const questions = await Question.find(filter).sort({ stage: 1, order: 1 });
    res.json({ questions });
  } catch (err) {
    next(err);
  }
}

export async function nextQuestion(req, res, next) {
  try {
    const { businessId, stage } = req.body;
    if (!businessId || !stage || !STAGE_LIST.includes(stage)) {
      return res.status(400).json({ error: "Valid businessId and stage are required" });
    }

    const business = await ownedBusiness(businessId, req.user._id);
    if (!business) return res.status(404).json({ error: "Business not found" });

    const user = await User.findById(req.user._id);

    if (user.plan === "free" && user.trialEndsAt && user.trialEndsAt < new Date()) {
      return res.status(403).json({ error: "Your free trial has ended. Upgrade to keep going." });
    }
    if (user.questionsUsed >= user.questionsQuota) {
      return res.status(403).json({ error: "You have used all questions in your current plan." });
    }

    const existingCount = await Question.countDocuments({ business: business._id, stage });
    const [text] = generateQuestions(stage, business.title, 1, existingCount);

    const question = await Question.create({
      business: business._id,
      stage,
      text,
      order: existingCount + 1,
    });

    user.questionsUsed += 1;
    await user.save();

    res.status(201).json({ question, user });
  } catch (err) {
    next(err);
  }
}
