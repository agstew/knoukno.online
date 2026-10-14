import mongoose from "mongoose";

const rateSchema = new mongoose.Schema(
  {
    answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true, unique: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Title", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rate: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Rate", rateSchema);
