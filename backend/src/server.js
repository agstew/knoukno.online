import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { sendDueMilestoneEmails } from "./utils/milestoneEmails.js";

const PORT = process.env.PORT || 5000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`KnoUKno API listening on port ${PORT}`));

    const runMilestoneCheck = () =>
      sendDueMilestoneEmails().catch((err) => console.error("Milestone email check failed:", err.message));
    runMilestoneCheck();
    setInterval(runMilestoneCheck, ONE_DAY_MS);
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
