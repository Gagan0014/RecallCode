import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
    title:{
        type:String,
        requried:true
    },
    titleSlug:{
        type:String,
        required:true,
        unique:true
    },
    difficulty:{
        type:String,
        enum: ["Easy", "Medium", "Hard"],
        requried:true
    },
    tags:{
        type:String
    },
    leetcodeUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Problem", problemSchema); 