import mongoose from 'mongoose'

const userProblemSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    probId:{
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

module.exports = mongoose.model("UserProblems" , userProblemSchema);