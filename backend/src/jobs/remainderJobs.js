import cron from 'node-cron';
import User from '../models/User.js';
import UserProblems from '../models/UserProblems.js';
import { sendReminderEmail } from '../services/emailService.js';

export const startReminderJob = () => {
    cron.schedule("* * * * *", async () => {

        const now = new Date();

        const currentTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

        const users = await User.find();

        for (const user of users) {
            
            const currentTime = new Intl.DateTimeFormat(
                "en-GB",
                {
                    timeZone: user.timeZone,
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }
            ).format(new Date());

            if (user.reviewTime !== currentTime) {
                continue;
            }
            const dueProblems = await UserProblems.find({
                userId: user._id,
                nextReviewDate: { $lte: new Date() }
            }).populate("problemId");

            const titles = dueProblems.map(
                p => p.problemId.title
            );

            if (titles.length === 0) {
                continue;
            }

            await sendReminderEmail(
                user.email,
                dueProblems
            );

            console.log(`Reminder sent to ${user.email}`);
        }
    });
};