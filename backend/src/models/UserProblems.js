import mongoose from 'mongoose'

const userProblemSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Problem",
        required:true
    },
    repetitions:{
        type:Number,
        default: 0
    },
    interval:{
        type: Number,
        default:1
    },
    easeFactor:{
        type:Number,
        default:2.5
    },
    nextReviewDate:{
        type: Date,
        required:true
    }
    
});

userProblemSchema.index(
    { userId: 1, problemId: 1 },
    { unique: true }
);
const UserProblems = mongoose.model("UserProblems" , userProblemSchema);
export default UserProblems;