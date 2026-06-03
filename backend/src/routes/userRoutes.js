import express from 'express'

import {createUser} from '../controllers/userController.js'
const router = express.Router();
router.get("/",createUser)
router.post("/",createUser);
router.put("/setting",createUser)

export default router;