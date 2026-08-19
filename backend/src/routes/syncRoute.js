import express from 'express'

const router = express.Router();
import { syncProblems } from '../controllers/syncProblemController.js'
import {protect} from '../middlewares/authMiddleware.js'

router.post("/sync", protect, syncProblems);
export default router