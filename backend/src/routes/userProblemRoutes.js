import express from 'express'

const router = express.Router()
import { createUserProblem,getUserProblems } from '../controllers/userProblemController.js';
router.post("/",createUserProblem);
router.get("/",getUserProblems);

export default router;