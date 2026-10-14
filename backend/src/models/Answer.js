import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true, unique: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Title", required: true, index: true },
    text: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);
