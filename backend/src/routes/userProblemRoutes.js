import express from 'express'
import {protect} from '../middlewares/authMiddleware.js'
const router = express.Router()
import { createUserProblem,getUserProblems } from '../controllers/userProblemController.js';
router.post("/",protect,createUserProblem);
router.get("/",protect,getUserProblems);

export default router;