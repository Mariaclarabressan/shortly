import {Router} from 'express';
import { creatUser, loginUser } from '../controllers/authController.js';
import { userMiddleware, loginMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post("/singup", userMiddleware, creatUser);
router.post("/singin", loginMiddleware, loginUser);

export default router;