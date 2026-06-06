import Problem from '../models/Problem.js';
import UserProblems from '../models/UserProblems.js';
import User from '../models/User.js';
import { getRecentSubmissions } from '../services/leetcodeService.js';

export const syncProblems = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.leetcodeUsername) {
            return res.status(400).json({
                message: "LeetCode username not set"
            });
        }

        const solvedProblems = await getRecentSubmissions(
            user.leetcodeUsername
        );

        let syncedCount = 0;

        for (const problem of solvedProblems) {

            // Find problem in DB
            let dbProblem = await Problem.findOne({
                titleSlug: problem.titleSlug
            });

            // Create if missing
            if (!dbProblem) {
                dbProblem = await Problem.create({
                    title: problem.title,
                    titleSlug: problem.titleSlug,
                    difficulty: problem.difficulty || "Easy"
                });
            }

            // Prevent duplicate UserProblems
            const existingUserProblem =
                await UserProblems.findOne({
                    userId: user._id,
                    problemId: dbProblem._id
                });

            if (existingUserProblem) {
                continue;
            }

            // Create UserProblem
            const nextReviewDate = new Date();

            nextReviewDate.setDate(
                nextReviewDate.getDate() +
                Math.floor(Math.random() * 7) + 1
            );
            await UserProblems.create({
                userId: user._id,
                problemId: dbProblem._id,
                repetitions: 0,
                interval: 1,
                easeFactor: 2.5,
                nextReviewDate
            });
            syncedCount++;
        }

        return res.status(200).json({
            message: "Sync completed successfully",
            syncedCount
        });

    } catch (error) {
        console.error("Sync Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};