import Average from "../models/Average.js";
import Title from "../models/Title.js";

export async function getAverage(req, res, next) {
  try {
    const { businessId } = req.query;
    const business = await Title.findOne({ _id: businessId, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Title not found" });

    const average = await Average.findOne({ user: req.user._id, business: business._id });
    res.json({
      average: average || {
        averageGrade: null,
        averageRate: null,
        gradedCount: 0,
        ratedCount: 0,
      },
    });
  } catch (err) {
    next(err);
  }
}
