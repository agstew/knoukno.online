import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true, unique: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Title", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    grade: { type: String, enum: ["A", "B", "C", "D", "F"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Grade", gradeSchema);
