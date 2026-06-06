import express from 'express'
const router = express.Router();
import { createProblem, getProblems , dueProblems , rateProblem} from '../controllers/problemController.js';
import { get } from 'mongoose';
router.post("/",createProblem);
router.get("/",getProblems);
router.get("/due/:userId",dueProblems)
router.post("/rate",rateProblem);

export default router;