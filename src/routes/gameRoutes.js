// routes/gameRoutes.js
import express from 'express';
import { addGame, deleteAllGames, deleteGameById, getAllGames, getGameById } from '../controllers/gameController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { gameUploadMiddleware } from '../middlewares/multer.js';

const router = express.Router();

router.post(
  '/add-games',
       // checks JWT
  isAdmin,         // ensures user has role "admin"
  gameUploadMiddleware,
  addGame
);

router.get("/games/:id" , getGameById)

router.get("/games" , getAllGames)

router.delete("/delete-game/:id" , deleteGameById)

router.delete("/delete-all", deleteAllGames);   

export default router;
