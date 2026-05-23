import { Noticia } from "../models/noticia/noticia.ts";
import type { Request, Response } from "express";
import { resumirConteudo } from "../services/gemini-summary-service.ts";

export class NoticiaController {
  static async createNoticia(req: Request, res: Response) {
    try {
      const { titulo, nick, content, evento } = req.body;
      const data = new Date().toISOString();
      const novaNoticia = new Noticia(
        0,
        titulo,
        data,
        nick,
        content,
        evento,
        [],
      );
      const savedNoticia = await novaNoticia.save();
      return res.status(201).json(savedNoticia);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getNoticiaByUserNickname(req: Request, res: Response) {
    try {
      const { nickname } = req.params as { nickname: string };
      const noticias = await Noticia.findByUserNickname(nickname);
      return res.status(200).json(noticias);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getAllNoticias(req: Request, res: Response) {
    try {
      const noticias = await Noticia.findAll();
      return res.status(200).json(noticias);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getNoticiaByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const noticia = await Noticia.findByID(Number(id));

      if (!noticia) {
        return res.status(404).json({ message: "Noticia não encontrada" });
      }

      return res.status(200).json(noticia);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async likeNoticia(req: Request, res: Response) {
    try {
      const { noticiaNumber } = req.params;
      const userId = String((req as any).user.id);
      const noticia = await Noticia.like(Number(noticiaNumber), userId);

      if (!noticia) {
        return res.status(404).json({ message: "Noticia não encontrada" });
      }

      return res.status(200).json(noticia);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async resumirNoticia(req: Request, res: Response) {
    try {
      const { noticiaNumber } = req.params;
      const noticia = await Noticia.findByID(Number(noticiaNumber));

      if (!noticia) {
        return res.status(404).json({ message: "Noticia nao encontrada" });
      }

      const resumo = await resumirConteudo({
        tipo: "noticia",
        titulo: (noticia as any).titulo,
        content: (noticia as any).content,
      });

      return res.status(200).json(resumo);
    } catch (error) {
      console.error("Erro ao resumir noticia:", error);
      return res.status(500).json({
        message: "Nao foi possivel gerar o resumo da noticia",
      });
    }
  }
}
