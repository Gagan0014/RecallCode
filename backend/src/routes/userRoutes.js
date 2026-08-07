import express from 'express'
import {protect} from '../middlewares/authMiddleware.js'
import { admin } from '../middlewares/adminMiddleware.js'
import {getUser , createUser} from '../controllers/userController.js'
const router = express.Router();
router.get("/",protect,getUser)
router.post("/",protect,admin,createUser);

export default router;
