import express from "express";
import { PostController } from "../controllers/post-controller.ts";
import { authMiddleware } from "../middlewares/jwt-middleware.ts";

const PostRouter = express.Router();

PostRouter.post("/createPost", authMiddleware, PostController.createPost);

PostRouter.get(
  "/getPostsByAutorNickname/:autorNickname",
  authMiddleware,
  PostController.getPostsByAutorNickname,
);

PostRouter.get("/getAllPosts", authMiddleware, PostController.getAllPosts);

PostRouter.get("/getPostByID/:id", authMiddleware, PostController.getPostByID);

PostRouter.get(
  "/resumirPost/:postNumber",
  authMiddleware,
  PostController.resumirPost,
);

PostRouter.put(
  "/likePost/:postNumber",
  authMiddleware,
  PostController.likePost,
);

export default PostRouter;
