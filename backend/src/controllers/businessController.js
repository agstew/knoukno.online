import Business from "../models/Business.js";

export async function listBusinesses(req, res, next) {
  try {
    const businesses = await Business.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ businesses });
  } catch (err) {
    next(err);
  }
}

export async function createBusiness(req, res, next) {
  try {
    const { title, industry, location, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Business title is required" });
    }
    const business = await Business.create({
      user: req.user._id,
      title: title.trim(),
      industry: (industry || "").trim(),
      location: (location || "").trim(),
      description: (description || "").trim(),
    });
    res.status(201).json({ business });
  } catch (err) {
    next(err);
  }
}

export async function getBusiness(req, res, next) {
  try {
    const business = await Business.findOne({ _id: req.params.id, user: req.user._id });
    if (!business) return res.status(404).json({ error: "Business not found" });
    res.json({ business });
  } catch (err) {
    next(err);
  }
}
