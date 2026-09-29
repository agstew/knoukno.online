import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    passwordHash: { type: String, required: true },
    plan: { type: String, enum: ["free", "member", "pro"], default: "free" },
    questionsQuota: { type: Number, default: 5 },
    questionsUsed: { type: Number, default: 0 },
    trialEndsAt: { type: Date },
    planRenewsAt: { type: Date },
  },
  { timestamps: true }
);

// Never leak the password hash in API responses
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
