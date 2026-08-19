import express from 'express'
import {protect} from '../middlewares/authMiddleware.js'
import { admin } from '../middlewares/adminMiddleware.js'
const router = express.Router()
import { createUserProblem,getUserProblems } from '../controllers/userProblemController.js';
router.post("/",protect,createUserProblem);
router.get("/",protect,admin,getUserProblems);

export default router;