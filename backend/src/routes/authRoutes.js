import express from 'express'

const router = express.Router();
import { protect } from '../middlewares/authMiddleware.js'
import { 
    register,
    login,
    getMe,
    updatePreferences
} from '../controllers/authController.js';

router.post("/register",register);
router.post("/login",login);
router.get("/profile",protect,getMe);
router.post("/preferences",protect,updatePreferences);
export default router