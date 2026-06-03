import UserProblem from '../models/UserProblems.js'

export const createUserProblem = async(req,res)=>{
    try{
        const userProblem = await UserProblem.create(req.body)
        res.status(201).json(userProblem)
    }catch(error){
        console.log(error);
        res.json(500).json({
            messgae:error.messgae
        })
    }
}

export const getUserProblems = async(req,res)=>{
    try{
        const userProblems = await UserProblem.find()
        .populate("userId")
        .populate("probId")

        res.status(200).json(userProblems)
    }catch(error){
        res.status(500).json({
            messgae:error.messgae
        })
    }
}