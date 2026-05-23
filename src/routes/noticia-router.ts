import express from "express";
import { NoticiaController } from "../controllers/noticia-controller.ts";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/jwt-middleware.ts";

const NoticiaRouter = express.Router();

NoticiaRouter.post(
  "/createNoticia",
  authMiddleware,
  adminMiddleware,
  NoticiaController.createNoticia,
);

NoticiaRouter.get(
  "/getNoticiaByUserNickname/:nickname",
  authMiddleware,
  NoticiaController.getNoticiaByUserNickname,
);

NoticiaRouter.get(
  "/getAllNoticias",
  authMiddleware,
  NoticiaController.getAllNoticias,
);

NoticiaRouter.get(
  "/getNoticiaByID/:id",
  authMiddleware,
  NoticiaController.getNoticiaByID,
);

NoticiaRouter.get(
  "/resumirNoticia/:noticiaNumber",
  authMiddleware,
  NoticiaController.resumirNoticia,
);

NoticiaRouter.put(
  "/likeNoticia/:noticiaNumber",
  authMiddleware,
  NoticiaController.likeNoticia,
);

export default NoticiaRouter;
