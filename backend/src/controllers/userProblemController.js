import UserProblem from "../models/UserProblems.js";
import Problem from "../models/Problem.js";

export const createUserProblem = async (req, res) => {
  try {
    const {
      title,
      titleSlug,
      difficulty,
      tags,
      leetcodeUrl
    } = req.body;

    // Check if the global Problem already exists
    let problem = await Problem.findOne({ titleSlug });

    // Create the global Problem only if it doesn't exist
    if (!problem) {
      problem = await Problem.create({
        title,
        titleSlug,
        difficulty,
        tags,
        leetcodeUrl
      });
    }

    // Check if this user already has this problem
    const existingUserProblem = await UserProblem.findOne({
      userId: req.user.id,
      problemId: problem._id
    });

    if (existingUserProblem) {
      return res.status(400).json({
        message: "Problem already added to your list"
      });
    }

    // Create user-specific problem record
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


// Admin: get all UserProblems
export const getUserProblems = async (req, res) => {
  try {
    const userProblems = await UserProblem.find()
      .populate("userId")
      .populate("problemId");

    res.status(200).json(userProblems);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};