import type { Response, Request } from "express";
import { Post } from "../models/post/post.ts";
import { resumirConteudo } from "../services/gemini-summary-service.ts";

export class PostController {
  static async createPost(req: Request, res: Response) {
    try {
      const { content, autorNickname, titulo } = req.body as {
        content: string;
        autorNickname: string;
        titulo?: string;
      };
      const date = new Date().toISOString();
      const newPost = new Post(0, content, date, autorNickname, 0, [], titulo);
      await newPost.save();
      return res.status(201).json(newPost);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await Post.findAll();
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getPostsByAutorNickname(req: Request, res: Response) {
    try {
      const { autorNickname } = req.params as { autorNickname: string };
      const posts = await Post.findAllByAutorNickname(autorNickname);
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getPostByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await Post.findByPostNumber(Number(id));

      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async likePost(req: Request, res: Response) {
    try {
      const { postNumber } = req.params;
      const userId = String((req as any).user.id);
      const post = await Post.like(Number(postNumber), userId);

      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async resumirPost(req: Request, res: Response) {
    try {
      const { postNumber } = req.params;
      const post = await Post.findByPostNumber(Number(postNumber));

      if (!post) {
        return res.status(404).json({ message: "Post nao encontrado" });
      }

      const resumo = await resumirConteudo({
        tipo: "post",
        titulo: (post as any).titulo,
        content: (post as any).content,
      });

      return res.status(200).json(resumo);
    } catch (error) {
      console.error("Erro ao resumir post:", error);
      return res.status(500).json({
        message: "Nao foi possivel gerar o resumo do post",
      });
    }
  }
}
