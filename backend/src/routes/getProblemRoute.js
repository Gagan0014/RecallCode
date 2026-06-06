import express from 'express';
import { getRecentSubmissions } from '../services/leetcodeService.js';
const router = express.Router();

router.get("/recent/:username", async(req,res)=>{
    try{
    const data = await getRecentSubmissions(
        req.params.username
    );

    res.json(data);
}catch(error){
    res.status(500).json({
        message:error.message
    });
}
});

export default router;