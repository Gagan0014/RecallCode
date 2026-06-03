import express from 'express'
const router = express.Router();
import { createProblem, getProblems} from '../controllers/problemController.js';
import { get } from 'mongoose';
router.post("/",createProblem);
router.get("/",getProblems);
// router.post("/sync");
// router.get("/due");
// router.post("/rate");

export default router;