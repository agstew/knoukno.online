import User from "../models/User.js";
import { send730DayEmail } from "./email.js";

const MILESTONE_DAYS = 730;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Finds users who crossed their 730-day (2-year) signup anniversary and
// haven't been emailed about it yet, sends the email, then marks them sent.
export async function sendDueMilestoneEmails() {
  const cutoff = new Date(Date.now() - MILESTONE_DAYS * MS_PER_DAY);
  const dueUsers = await User.find({
    createdAt: { $lte: cutoff },
    milestone730EmailSentAt: null,
    emailOptIn: { $ne: false },
  });

  for (const user of dueUsers) {
    try {
      await send730DayEmail(user.email, user.name);
      user.milestone730EmailSentAt = new Date();
      await user.save();
    } catch (err) {
      console.error(`Failed to send 730-day email to ${user.email}:`, err.message);
    }
  }

  return dueUsers.length;
}
