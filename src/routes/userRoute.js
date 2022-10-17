import {Router} from 'express';
import {showUrl, getUrlById, showShortUrl, deleteUrl, showUser, showRankingUrl} from '../controllers/userController.js';
import {tokenMiddleware, creatUrlMiddleware, showUrlMiddleware, showShortUrlMiddleware, deleteUrlMiddleware} from '../middlewares/userMiddleware.js';

const router = Router();

router.post("/urls/shorten", tokenMiddleware, creatUrlMiddleware, showUrl);
router.get("/urls/:id", showUrlMiddleware, getUrlById);
router.get("/urls/open/:shortUrl", showShortUrlMiddleware, showShortUrl);
router.delete("/urls/:id",tokenMiddleware, deleteUrlMiddleware, deleteUrl);
router.get("/users/me", tokenMiddleware, showUser);
router.get("/ranking", showRankingUrl)

export default router;