import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

export default mongoose.model("Business", businessSchema);
