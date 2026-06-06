import cron from 'node-cron';
import User from '../models/User.js';
import UserProblems from '../models/UserProblems.js';
import { sendReminderEmail } from '../services/emailService.js';

export const startReminderJob = () => {
    cron.schedule("* * * * *", async () => {

        const users = await User.find(
            {
                reviewTime: { $exists: true }
            }
        );

        for (const user of users) {
            try{

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
        // Prevent duplicate email
        const today = new Date().toDateString();

            if (user.lastReminderSent && user.lastReminderSent.toDateString() === today)
            {
                continue;
            }

            const dueProblems = await UserProblems.find({
                userId: user._id,
                nextReviewDate: { $lte: new Date() }
            }).populate("problemId");
            if(dueProblems.length === 0){
                continue;
            }

            await sendReminderEmail(
                user.email,
                dueProblems
            );
            user.lastReminderSent = new Date();
            await user.save();

            console.log(`Reminder sent to ${user.email}`);
        }catch(error){
            console.error(`failed to send reminder to ${user.email}:`, error.message);
        }
        }
    });
};