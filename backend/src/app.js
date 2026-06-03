import express from 'express'
// import problemRoutes from './routes/problemRoutes'
import userRoutes from './routes/userRoutes.js'
const app = express()
app.use(express.json())

// app.use("/api.problems",problemRoutes);
app.use("/api/users",userRoutes);
app.get("/",(req,res)=>{
    res.send("APP is running");
})
export default app;