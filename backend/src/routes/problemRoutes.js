import express from 'express'
const router = express.Router();
import { createProblem, getProblems , dueProblems , rateProblem , getMyProblems} from '../controllers/problemController.js';
import { protect } from "../middlewares/authMiddleware.js"
router.post("/",protect,createProblem);
router.get("/",protect,getProblems);
router.get("/due",protect,dueProblems)
router.post("/rate",protect,rateProblem);
router.get("/myproblems",protect,getMyProblems);

export default router;