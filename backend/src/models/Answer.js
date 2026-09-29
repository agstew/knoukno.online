import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true, unique: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    text: { type: String, required: true, maxlength: 5000 },
    grade: { type: String, enum: ["A", "B", "C", "D", "F", null], default: null },
    rank: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);
