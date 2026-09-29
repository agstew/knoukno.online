import mongoose from "mongoose";

export const STAGES = ["law", "location", "hiring", "people"];

const questionSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    stage: { type: String, enum: STAGES, required: true },
    text: { type: String, required: true, maxlength: 600 },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
