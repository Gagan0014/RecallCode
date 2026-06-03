import mongoose from 'mongoose'
import { use } from 'react';

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
leetcodeUsername:{
    type:String,
    required:true
},
emailTime:{
    type:String,
    default:"08:00"
},
timeZone:{
    type:String,
    default:"Asia/kolkata"
}
});

const User = mongoose.model("User",userSchema);
export default User;