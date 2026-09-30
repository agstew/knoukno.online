const User = require('../models/User');
const AdminMessage = require('../models/AdminMessage');
const ScheduledEmail = require('../models/ScheduledEmail');
const mailer = require('./mailer');

// Finds due, pending scheduled emails and sends each to every user.
async function processDueScheduledEmails() {
  const due = await ScheduledEmail.find({ status: 'pending', sendAt: { $lte: new Date() } });
  if (due.length === 0) return;

  for (const scheduled of due) {
    try {
      if (!mailer.isConfigured()) throw new Error('Email is not configured on the server.');
      const users = await User.find().select('_id email');
      let sent = 0;
      let failed = 0;

      for (const user of users) {
        let status = 'sent';
        let error;
        try {
          await mailer.sendMail({ to: user.email, subject: scheduled.subject, text: scheduled.message });
          sent += 1;
        } catch (sendErr) {
          status = 'failed';
          error = sendErr.message;
          failed += 1;
        }
        await AdminMessage.create({ userId: user._id, toEmail: user.email, subject: scheduled.subject, message: scheduled.message, status, error });
      }

      scheduled.status = 'sent';
      scheduled.totalRecipients = users.length;
      scheduled.sentCount = sent;
      scheduled.failedCount = failed;
      scheduled.processedAt = new Date();
      await scheduled.save();
    } catch (err) {
      scheduled.status = 'failed';
      scheduled.error = err.message;
      scheduled.processedAt = new Date();
      await scheduled.save();
    }
  }
}

module.exports = { processDueScheduledEmails };
