import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name:{
      type:String,
      required:true
  },
  email:{
      type:String,
      required:true,
      unique: true
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
  },
  password: {
     type: String,
     required: true
  },
  reviewTime: {
      type: String,
      default: "20:00"
  },
  lastReminderSent: {
      type: Date
  },
  dailyReviewLimit: {
      type: Number,
      default: 10
  },
  // admin flag to allow restricted actions like creating users
  isAdmin: {
      type: Boolean,
      default: false
  }
});

// ensure unique index exists for email to prevent duplicates at DB level
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User",userSchema);
export default User;
