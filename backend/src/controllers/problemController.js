import Problem from '../models/Problem.js'
import User from '../models/User.js';
import UserProblems from '../models/UserProblems.js';
export const createProblem = async(req,res)=>{
    try{
        const problem  = await Problem.create(req.body)

        res.status(201).json(problem);
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const getMyProblems = async(req,res)=>{
    try{
        const userProblems = await UserProblems.find({
            userId: req.user.id
        }).populate("problemId");
        res.status(200).json(userProblems);
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const getProblems = async(req,res)=>{
    try{
        const problems = await Problem.find();
        res.status(200).json(problems);
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
export const dueProblems = async(req,res)=>{
    try{
        const problems = await UserProblems.find({
            userId: req.user.id,
            nextReviewDate:{ $lte: new Date()}
        })
        .limit(user.dailyReviewLimit)
        .populate("problemId")
        res.status(200).json(problems)
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}
export const rateProblem = async(req,res)=>{
    try{
        const {userProblemId , quality} = req.body;
        const userProblem = await UserProblems.findById(userProblemId);
        if(!userProblem){
            return res.status(404).json({
                message: "User Problem Not Found"
            })
        }
        if (userProblem.userId.toString() !==req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        if (quality < 0 || quality > 5) {
             return res.status(400).json({
                message: "Quality must be between 0 and 5"
             });
        }
        else if(quality<3){
            userProblem.repetitions = 0;
            userProblem.interval = 1;
        }else{
            userProblem.repetitions +=1;
            if(userProblem.repetitions===1){
                userProblem.interval = 1;
            }else if(userProblem.repetitions === 2){
                userProblem.interval = 6;
            }else{
                userProblem.interval = Math.round(
                    userProblem.interval * userProblem.easeFactor
                );
            }
        }
        userProblem.easeFactor = userProblem.easeFactor+(0.1 -(5 - quality) * (0.08 + (5 - quality) * 0.02));
    
        if(userProblem.easeFactor < 1.3){
            userProblem.easeFactor=1.3;
        }
        userProblem.nextReviewDate = new Date(
            Date.now() +userProblem.interval * 24 * 60 * 60 * 1000
        );
        await userProblem.save();
        res.status(200).json(userProblem)
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}