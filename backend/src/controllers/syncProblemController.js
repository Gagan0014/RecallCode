import Problem from '../models/Problem.js'
import UserProblems from '../models/UserProblems.js'
import User from '../models/User.js'

export const syncProblems = async(req,res)=>{
    try{
        const user = await User.findById(req.body.userId);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        // dummy data for test 
        const problems = await Problem.insertMany([
            {
                title: "two sum",
                titleSlug: "two-sum",
                difficulty: "Easy"
            },
            {
                title: "three-sum",
                titleSlug: "three-sum",
                difficulty: "Medium"
            }
        ]);
        const userProblems = problems.map(problem=>({
            userId: user._id,
            problemId: problem._id,
            repetitions:0,
            interval:1,
            easeFactor:2.5,
            nextReviewDate:new Date()
        }));
        await UserProblems.insertMany(userProblems);
        res.status(200).json({
            message:"sync complete"
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}