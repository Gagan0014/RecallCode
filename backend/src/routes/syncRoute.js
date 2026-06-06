import express from 'express'

const router = express.Router();
import { syncProblems } from '../controllers/syncProblemController.js'

router.post("/sync",syncProblems);
export default router