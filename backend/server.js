import dotenv from 'dotenv'
dotenv.config();
import User from "./src/models/User.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
connectDB();

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
});
