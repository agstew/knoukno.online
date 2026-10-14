import Average from "../models/Average.js";
import Grade from "../models/Grade.js";
import Rate from "../models/Rate.js";

const GRADE_POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };

// Recomputes and caches the average grade/rate for a (user, business) pair.
// Called whenever a grade or rate is saved, so the Average page reads instantly.
export async function refreshAverage(userId, businessId) {
  const [grades, rates] = await Promise.all([
    Grade.find({ user: userId, business: businessId }),
    Rate.find({ user: userId, business: businessId }),
  ]);

  const averageGrade =
    grades.length > 0
      ? grades.reduce((sum, g) => sum + GRADE_POINTS[g.grade], 0) / grades.length
      : null;
  const averageRate =
    rates.length > 0 ? rates.reduce((sum, r) => sum + r.rate, 0) / rates.length : null;

  return Average.findOneAndUpdate(
    { user: userId, business: businessId },
    {
      user: userId,
      business: businessId,
      averageGrade,
      averageRate,
      gradedCount: grades.length,
      ratedCount: rates.length,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
