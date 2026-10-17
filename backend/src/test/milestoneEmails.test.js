import mongoose from "mongoose";
import { describe, expect, it, vi } from "vitest";
import User from "../models/User.js";
import { registerUser } from "./helpers.js";

vi.mock("../utils/email.js", () => ({
  sendWelcomeEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendBroadcastEmail: vi.fn(),
  send730DayEmail: vi.fn(),
}));

import { send730DayEmail } from "../utils/email.js";
import { sendDueMilestoneEmails } from "../utils/milestoneEmails.js";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("sendDueMilestoneEmails", () => {
  it("emails and marks a user who passed the 730-day mark", async () => {
    const { user } = await registerUser();
    const createdAt = new Date(Date.now() - 731 * DAY_MS);
    await User.collection.updateOne({ _id: new mongoose.Types.ObjectId(user._id) }, { $set: { createdAt } });
    send730DayEmail.mockResolvedValue();

    const count = await sendDueMilestoneEmails();
    expect(count).toBe(1);
    expect(send730DayEmail).toHaveBeenCalledWith(user.email, user.name);

    const updated = await User.findById(user._id);
    expect(updated.milestone730EmailSentAt).toBeTruthy();
  });

  it("does not email a user who hasn't reached 730 days yet", async () => {
    const { user } = await registerUser();
    const createdAt = new Date(Date.now() - 100 * DAY_MS);
    await User.collection.updateOne({ _id: new mongoose.Types.ObjectId(user._id) }, { $set: { createdAt } });
    send730DayEmail.mockResolvedValue();

    const count = await sendDueMilestoneEmails();
    expect(count).toBe(0);
    expect(send730DayEmail).not.toHaveBeenCalled();
  });

  it("does not email the same user twice", async () => {
    const { user } = await registerUser();
    const createdAt = new Date(Date.now() - 731 * DAY_MS);
    await User.collection.updateOne({ _id: new mongoose.Types.ObjectId(user._id) }, { $set: { createdAt, milestone730EmailSentAt: new Date() } });
    send730DayEmail.mockResolvedValue();

    const count = await sendDueMilestoneEmails();
    expect(count).toBe(0);
    expect(send730DayEmail).not.toHaveBeenCalled();
  });

  it("skips users who opted out of email", async () => {
    const { user } = await registerUser();
    const createdAt = new Date(Date.now() - 731 * DAY_MS);
    await User.collection.updateOne({ _id: new mongoose.Types.ObjectId(user._id) }, { $set: { createdAt, emailOptIn: false } });
    send730DayEmail.mockResolvedValue();

    const count = await sendDueMilestoneEmails();
    expect(count).toBe(0);
    expect(send730DayEmail).not.toHaveBeenCalled();
  });
});
