import express from 'express'
const router = express.Router();
import { createProblem, getProblems , dueProblems , rateProblem} from '../controllers/problemController.js';
import { get } from 'mongoose';
import { protect } from "../middlewares/authMiddleware.js"
router.post("/",createProblem);
router.get("/",getProblems);
router.get("/due",protect,dueProblems)
router.post("/rate",protect,rateProblem);

export default router;