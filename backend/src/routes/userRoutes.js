import express from 'express'

import {getUser , createUser} from '../controllers/userController.js'
const router = express.Router();
router.get("/",getUser)
router.post("/",createUser);
router.put("/setting",createUser)

export default router;