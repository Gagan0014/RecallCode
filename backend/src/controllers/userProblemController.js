import UserProblem from "../models/UserProblems.js";
import Problem from "../models/Problem.js";

export const createUserProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);

        const userProblem = await UserProblem.create({
            userId: req.user.id,
            problemId: problem._id,
            nextReviewDate: new Date()
        });

        res.status(201).json(userProblem);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};
export const getUserProblems = async(req,res)=>{
    try{
        const userProblems = await UserProblem.find()
        .populate("userId")
        .populate("problemId")

        res.status(200).json(userProblems)
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}