import {Router} from 'express';
import { creatUser, loginUser } from '../controllers/authController.js';
import { userMiddleware, loginMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post("/signup", userMiddleware, creatUser);
router.post("/signin",loginMiddleware, loginUser);

export default router;