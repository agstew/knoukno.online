import Answer from "../models/Answer.js";
import Title from "../models/Title.js";

export async function getDashboard(req, res, next) {
  try {
    const titles = await Title.find({ user: req.user._id }).sort({ createdAt: -1 });
    const titleIds = titles.map((t) => t._id);
    const answeredCount = await Answer.countDocuments({ business: { $in: titleIds } });

    res.json({
      user: req.user,
      titles,
      titleCount: titles.length,
      answeredCount,
    });
  } catch (err) {
    next(err);
  }
}
