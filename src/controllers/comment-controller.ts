import type { Response, Request } from "express";
import { Comment } from "../models/comment/comment.ts";
import { Post } from "../models/post/post.ts";
import { Noticia } from "../models/noticia/noticia.ts";

export class CommentController {
  static async createCommentary(req: Request, res: Response) {
    try {
      const { content, autorNickname, targetType } = req.body as {
        content: string;
        autorNickname: string;
        targetType: "Noticia" | "Post" | "Comment";
        targetNumber: number | string;
      };
      const targetNumber = Number(req.body.targetNumber);

      if (
        !content ||
        !autorNickname ||
        !targetType ||
        Number.isNaN(targetNumber)
      ) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios ausentes" });
      }

      if (!["Noticia", "Post", "Comment"].includes(targetType)) {
        return res.status(400).json({ message: "Tipo de destino inválido" });
      }

      let targetExists = null;
      if (targetType === "Noticia") {
        targetExists = await Noticia.findByID(targetNumber);
      } else if (targetType === "Post") {
        targetExists = await Post.findByPostNumber(targetNumber);
      } else {
        targetExists = await Comment.findByCommentNumber(targetNumber);
      }

      if (!targetExists) {
        return res
          .status(404)
          .json({ message: "Destino do comentário não encontrado" });
      }

      const date = new Date().toISOString();
      const newCommentary = new Comment(
        0,
        content,
        date,
        autorNickname,
        targetType,
        targetNumber,
        0,
        [],
      );

      const savedCommentary = await newCommentary.save();

      if (targetType === "Noticia") {
        await Noticia.addComment(targetNumber, savedCommentary._id);
      } else if (targetType === "Post") {
        await Post.addComment(targetNumber, savedCommentary._id);
      } else {
        await Comment.addChildComment(targetNumber, savedCommentary._id);
      }

      return res.status(201).json(savedCommentary);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCommentariesByUserNickname(req: Request, res: Response) {
    try {
      const { nickname } = req.params as { nickname: string };
      const commentaries = await Comment.findAllByUserNickname(nickname);
      return res.status(200).json(commentaries);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllCommentaries(req: Request, res: Response) {
    try {
      const commentaries = await Comment.findAll();
      return res.status(200).json(commentaries);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCommentariesByDate(req: Request, res: Response) {
    try {
      const { date } = req.params as { date: string };
      const commentaries = await Comment.findByDate(date);
      return res.status(200).json(commentaries);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCommentaryByCommentNumber(req: Request, res: Response) {
    try {
      const { commentNumber } = req.params;
      const commentary = await Comment.findByCommentNumber(
        Number(commentNumber),
      );
      if (!commentary) {
        return res.status(404).json({ message: "Commentary not found" });
      }
      return res.status(200).json(commentary);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async likeCommentary(req: Request, res: Response) {
    try {
      const { commentaryNumber } = req.params;
      const userId = String((req as any).user.id);
      const commentary = await Comment.like(Number(commentaryNumber), userId);
      if (!commentary) {
        return res.status(404).json({ message: "Comentário não encontrado" });
      }
      return res.status(200).json(commentary);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
