import dotenv from 'dotenv'
dotenv.config();
import User from "./src/models/User.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
connectDB();

app.get("/test", async (req,res)=>{
    await User.create({
        name:"Shubham",
        email:"shubham@gmail.com",
        leetcodeUsername:"SharmaShubham",
    });

    res.send("Inserted");
});

app.listen(5000,()=>{
    console.log("App is running on port 5000");
});
