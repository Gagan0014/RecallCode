import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import problemRoutes from './routes/problemRoutes.js'
import userProblemRoutes from './routes/userProblemRoutes.js'
import syncRoute from './routes/syncRoute.js'
import authRoutes from './routes/authRoutes.js';
import getProblems from './routes/getProblemRoute.js';
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/getProblems",getProblems);
app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoute);
app.use("/api/users",userRoutes);
app.use("/api/problems",problemRoutes);
app.use("/api/userproblems",userProblemRoutes);
app.get("/",(req,res)=>{
    res.send("APP is running");
})
export default app;