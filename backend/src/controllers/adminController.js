import Answer from "../models/Answer.js";
import Business from "../models/Business.js";
import User from "../models/User.js";

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "role must be 'user' or 'admin'" });
    }
    if (req.params.id === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({ error: "You cannot remove your own admin access" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function getStats(_req, res, next) {
  try {
    const [userCount, businessCount, answerCount] = await Promise.all([
      User.countDocuments(),
      Business.countDocuments(),
      Answer.countDocuments(),
    ]);
    res.json({ userCount, businessCount, answerCount });
  } catch (err) {
    next(err);
  }
}
