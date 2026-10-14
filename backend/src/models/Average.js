import mongoose from "mongoose";

// One cached snapshot per (user, business) pair, recomputed whenever a grade
// or rate is saved - avoids recalculating from scratch on every page view.
const averageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Title", required: true, index: true },
    averageGrade: { type: Number, default: null },
    averageRate: { type: Number, default: null },
    gradedCount: { type: Number, default: 0 },
    ratedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

averageSchema.index({ user: 1, business: 1 }, { unique: true });

export default mongoose.model("Average", averageSchema);
