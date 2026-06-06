import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    titleSlug:{
        type:String,
        required:true,
        unique:true
    },
    difficulty:{
        type:String,
        enum: ["Easy", "Medium", "Hard"],
        required:true
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

const Problem = mongoose.model("Problem", problemSchema); 
export default Problem;