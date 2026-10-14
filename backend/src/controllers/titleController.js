import Title from "../models/Title.js";

export async function listTitles(req, res, next) {
  try {
    const titles = await Title.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ titles });
  } catch (err) {
    next(err);
  }
}

export async function createTitle(req, res, next) {
  try {
    const { title, industry, location, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Business title is required" });
    }
    const created = await Title.create({
      user: req.user._id,
      title: title.trim(),
      industry: (industry || "").trim(),
      location: (location || "").trim(),
      description: (description || "").trim(),
    });
    res.status(201).json({ title: created });
  } catch (err) {
    next(err);
  }
}

export async function getTitle(req, res, next) {
  try {
    const title = await Title.findOne({ _id: req.params.id, user: req.user._id });
    if (!title) return res.status(404).json({ error: "Title not found" });
    res.json({ title });
  } catch (err) {
    next(err);
  }
}
