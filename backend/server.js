import dotenv from 'dotenv'
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { startReminderJob } from './src/jobs/remainderJobs.js';

const startServer = async () => {
    await connectDB();
    startReminderJob();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
});