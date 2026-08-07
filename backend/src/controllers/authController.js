import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { createUserService } from '../services/userService.js'

export const register = async(req,res)=>{
    try{
        const {name , email , password , leetcodeUsername} = req.body;

        const user = await createUserService({ name, email, password, leetcodeUsername });

        // sign token
        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )

        res.status(201).json({ user, token })
    }catch(error){
        if (error && (error.code === 'DUPLICATE' || error.status === 400)) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({
            message:error.message
        });
    }
}

export const login = async(req,res)=>{
    try{
        const {email , password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            });
        }
        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )
        res.status(200).json({token});
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export const updatePreferences = async(req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                reviewTime: req.body.reviewTime,
                timeZone: req.body.timeZone,
                dailyReviewLimit: req.body.dailyReviewLimit
            },
            {
                new:true
            }
        );
        if (!user) {
            return res.status(404).json(
                {
                    message: "User not found" 
                }); 
        }   

        res.status(200).json(user);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}
