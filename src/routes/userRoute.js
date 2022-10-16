import {Router} from 'express';
import {showUrl, getUrlById, showShortUrl, deleteUrl, showUser, showRankingUrl} from '../controllers/userController.js';
import {tokenAuthorizationMiddleware, creatUrlMiddleware, showUrlMiddleware, showShortUrlMiddleware, deleteUrlMiddleware, showUserMiddleware} from '../middlewares/userMiddleware.js';

const router = Router();

router.post("/urls/shorten", tokenAuthorizationMiddleware, creatUrlMiddleware, showUrl);
router.get("/urls:id", showUrlMiddleware, getUrlById);
router.get("/urls/open/:shortUrl", showShortUrlMiddleware, showShortUrl);
router.delete("/urls/:id", tokenAuthorizationMiddleware, deleteUrlMiddleware, deleteUrl);
router.get("/users/me", tokenAuthorizationMiddleware, showUserMiddleware, showUser);
router.get("/ranking", showRankingUrl)

export default router;