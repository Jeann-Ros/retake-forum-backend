import express from "express";
import { CommentController } from "../controllers/comment-controller.ts";
import { authMiddleware } from "../middlewares/jwt-middleware.ts";

const CommentRouter = express.Router();

CommentRouter.post(
  "/createCommentary",
  authMiddleware,
  CommentController.createCommentary,
);

CommentRouter.get(
  "/getCommentariesByUserNickname/:nickname",
  authMiddleware,
  CommentController.getCommentariesByUserNickname,
);

CommentRouter.get(
  "/getAllCommentaries",
  authMiddleware,
  CommentController.getAllCommentaries,
);

CommentRouter.get(
  "/getCommentariesByDate/:date",
  authMiddleware,
  CommentController.getCommentariesByDate,
);

CommentRouter.put(
  "/likeCommentary/:commentaryNumber",
  authMiddleware,
  CommentController.likeCommentary,
);

export default CommentRouter;
