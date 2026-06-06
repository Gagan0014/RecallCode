import dotenv from 'dotenv'
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { startReminderJob } from './src/jobs/remainderJobs.js';
connectDB();

startReminderJob();
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
});
