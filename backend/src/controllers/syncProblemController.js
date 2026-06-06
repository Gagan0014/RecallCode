import Problem from '../models/Problem.js'
import UserProblems from '../models/UserProblems.js'
import User from '../models/User.js'

export const syncProblems = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        // dummy data for test 
        let problems = await Problem.find();
        if(problems.length===0){
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
    }
        for(const problem of problems){
            const exists = await UserProblems.findOne({
                userId: user._id,
                problemId:problem._id
            });
            if(!exists){
                await UserProblems.create({
                    userId:user._id,
                    problemId:problem._id,
                    repetitions:0,
                    interval:1,
                    easeFactor:2.5,
                    nextReviewDate: new Date()
                });
            }
        }
        res.status(200).json({
            message:"sync completed"
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}