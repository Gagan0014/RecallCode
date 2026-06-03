import express from 'express'
const router = express.Router();

router.get("/");
router.post("/sync");
router.get("/due");
router.post("/rate");

export default router;