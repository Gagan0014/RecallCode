import express from 'express'

const app = express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("APP is running");
})
export default app;